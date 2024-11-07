import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
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
    const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

    console.log("Using executable path:", executablePath);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log("Chromium launched successfully.");

    const page = await browser.newPage();
    const results: { url: string; rawText: string; filePath: string }[] = [];

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created upload directory at ${uploadDir}`);
    } else {
      console.log(`Upload directory already exists at ${uploadDir}`);
    }

    for (const url of urls) {
      console.log(`Navigating to URL: ${url}`);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      } catch (error) {
        console.error(`Failed to load URL: ${url}`, error);
        continue; // Skip this URL and continue with the next one
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
        console.log(`Extracted text from ${url}`);
      } catch (error) {
        console.error(`Error extracting text from URL: ${url}`, error);
        continue; // Skip this URL and continue with the next one
      }

      // Generate PDF and ensure it is valid
      let pdfBuffer;
      try {
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });

        if (!pdfBuffer || pdfBuffer.length < 1024) {
          throw new Error("Generated PDF is empty or invalid");
        }
        console.log(`Generated PDF for ${url}`);
      } catch (error) {
        console.error(`Error generating PDF for URL: ${url}`, error);
        continue; // Skip this URL and continue with the next one
      }

      const fileName = `${url
        .replace(/https?:\/\//, "")
        .replace(/[^\w]/g, "_")}.pdf`;
      const filePath = path.join("uploads", fileName);
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
    console.log("Browser closed successfully.");

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error capturing page as PDF and extracting text:", error);
    res.status(500).json({
      error: "Failed to process URLs and create PDF.",
      details: error,
    });
  }
}
