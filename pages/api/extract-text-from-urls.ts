import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function capturePageAsPdfAndText(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("Invalid URLs array:", urls);
    return res.status(400).json({ error: "Invalid or empty URLs array" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const results = [];

    const uploadDir = "/tmp/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const url of urls) {
      console.log(`Navigating to URL: ${url}`);
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
      } catch (error) {
        console.error(`Failed to load URL: ${url}`, error);
        return res.status(500).json({
          error: `Failed to load URL: ${url}`,
          details: (error as Error).message,
        });
      }

      let rawText;
      try {
        rawText = await page.evaluate(() => {
          const contentElement =
            document.querySelector("#bodyContent") ||
            document.querySelector(".mw-parser-output") ||
            document.body;
          if (!contentElement) return "";
          const paragraphs = contentElement.querySelectorAll("p");
          return Array.from(paragraphs)
            .map((p) => p.textContent || "")
            .join("\n\n");
        });
      } catch (error) {
        console.error(`Error extracting text from URL: ${url}`, error);
        return res.status(500).json({
          error: `Error extracting text from URL: ${url}`,
          details: (error as Error).message,
        });
      }

      let pdfBuffer;
      try {
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });
        if (!pdfBuffer || pdfBuffer.length < 1024) {
          throw new Error("Generated PDF is empty or invalid");
        }
      } catch (error) {
        console.error(`Error generating PDF for URL: ${url}`, error);
        return res.status(500).json({
          error: `Error generating PDF for URL: ${url}`,
          details: (error as Error).message,
        });
      }

      const fileName = `${url
        .replace(/https?:\/\//, "")
        .replace(/[^\w]/g, "_")}.pdf`;
        const filePath = path.join(uploadDir, fileName);
        const fullFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullFilePath, pdfBuffer);
      console.log(`PDF saved to ${fullFilePath}`);

      results.push({
        url,
        rawText,
        filePath: `/${filePath}`,
      });
    }

    await browser.close();

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error capturing page as PDF and extracting text:", error);
    res.status(500).json({
      error: "Failed to process URLs and create PDF.",
      details: (error as Error).message,
    });
  } 
}
