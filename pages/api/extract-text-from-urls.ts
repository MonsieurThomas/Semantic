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

  console.log(
    "Environment PUPPETEER_EXECUTABLE_PATH:",
    process.env.PUPPETEER_EXECUTABLE_PATH
  );
  console.log("Environment CHROME_BIN:", process.env.CHROME_BIN);

  try {
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      path.resolve(".chromium-cache", "chromium", "chrome-linux", "chrome");

    console.log("Expected Chromium executable path:", executablePath);

    // Check if the Chromium executable path exists and is accessible
    if (!fs.existsSync(executablePath)) {
      console.error(`Chromium executable not found at ${executablePath}`);
      return res.status(500).json({
        error: "Chromium executable not found",
        details: `Chromium executable expected at ${executablePath} was not found.`,
      });
    }

    // Check directory structure and contents
    console.log("Listing .chromium-cache directory contents...");
    const chromiumCacheContents = fs.readdirSync(
      path.resolve(".chromium-cache")
    );
    console.log(".chromium-cache directory contents:", chromiumCacheContents);

    console.log("Listing chrome-linux directory contents...");
    const chromeLinuxPath = path.resolve(
      ".chromium-cache",
      "chromium",
      "chrome-linux"
    );
    const chromeLinuxContents = fs.readdirSync(chromeLinuxPath);
    console.log("chrome-linux directory contents:", chromeLinuxContents);

    console.log(
      "Attempting to launch Puppeteer with custom executable path..."
    );
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: executablePath,
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
        const gotoError = error as Error;
        console.error(`Failed to load URL: ${url}`, gotoError);
        return res.status(500).json({
          error: `Failed to load URL: ${url}`,
          details: gotoError.message,
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
        console.log(`Extracted text from ${url}`);
      } catch (error) {
        const evaluateError = error as Error;
        console.error(`Error extracting text from URL: ${url}`, evaluateError);
        return res.status(500).json({
          error: `Error extracting text from URL: ${url}`,
          details: evaluateError.message,
        });
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
        const pdfError = error as Error;
        console.error(`Error generating PDF for URL: ${url}`, pdfError);
        return res.status(500).json({
          error: `Error generating PDF for URL: ${url}`,
          details: pdfError.message,
        });
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
    const apiError = error as Error;
    console.error("Error capturing page as PDF and extracting text:", apiError);
    res.status(500).json({
      error: "Failed to process URLs and create PDF.",
      details: apiError.message,
    });
  }
}
