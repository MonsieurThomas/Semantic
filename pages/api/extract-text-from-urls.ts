import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function convertTextToPdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;

  console.log("Received request to convert text to PDF"); // Initial log
  console.log("Text content:", text ? text.substring(0, 100) + "..." : "No text provided"); // Log first 100 characters of text

  if (!text || typeof text !== "string") {
    console.log("Invalid text input:", text);
    return res.status(400).json({ error: "Invalid or empty text input" });
  }

  try {
    const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

    console.log("Launching Puppeteer with executablePath:", executablePath); // Log executable path

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Puppeteer browser launched"); // Log browser launch

    const page = await browser.newPage();
    console.log("New page created in Puppeteer"); // Log new page creation

    // Define HTML content for PDF generation
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <pre style="white-space: pre-wrap;">${text}</pre>
        </body>
      </html>
    `;
    console.log("HTML content for PDF generation prepared"); // Log HTML content preparation

    // Set the page content
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    console.log("Page content set in Puppeteer"); // Log page content setting

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    console.log("Upload directory path:", uploadDir); // Log upload directory path

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Upload directory created at:", uploadDir); // Log directory creation
    } else {
      console.log("Upload directory already exists:", uploadDir); // Log directory exists
    }

    // Generate PDF and ensure it is valid
    let pdfBuffer;
    try {
      console.log("Generating PDF..."); // Log PDF generation start
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      console.log("PDF generated"); // Log PDF generation

      if (!pdfBuffer || pdfBuffer.length < 1024) {
        console.log("Generated PDF is empty or too small"); // Log invalid PDF
        throw new Error("Generated PDF is empty or invalid");
      }
    } catch (error) {
      const pdfError = error as Error;
      console.error("Error generating PDF:", pdfError);
      return res.status(500).json({ error: "Error generating PDF", details: pdfError.message });
    }

    // Generate filename and save PDF
    const fileName = `TextArea.pdf`;
    const filePath = path.join("uploads", fileName);
    const fullFilePath = path.join(uploadDir, fileName);
    console.log("Saving PDF to:", fullFilePath); // Log PDF save path
    fs.writeFileSync(fullFilePath, pdfBuffer);
    console.log(`PDF saved to ${fullFilePath}`); // Log PDF save location

    await browser.close();
    console.log("Browser closed"); // Log browser close

    // Return the path to the saved PDF
    res.status(200).json({
      success: true,
      filePath: `/${filePath}`,
    });
    console.log("Response sent with file path:", `/${filePath}`); // Log response
  } catch (error) {
    const apiError = error as Error;
    console.error("Error processing text to PDF:", apiError);
    res.status(500).json({ error: "Failed to convert text to PDF.", details: apiError.message });
  }
}
