import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function capturePageAsPdfAndText(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urls } = req.body;

  console.log("Début de la fonction capturePageAsPdfAndText");

  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("Invalid URLs array:", urls);
    return res.status(400).json({ error: "Invalid or empty URLs array" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const results = [];
    let concatenatedText = "";

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const url of urls) {
      if (typeof url !== "string") continue; // Ignorer les URLs invalides
      console.log(`Navigating to URL: ${url}`);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      } catch (error) {
        console.error(`Failed to load URL: ${url}`, error);
        // Passer à l'URL suivante en cas d'erreur de chargement
        continue;
      }

      let rawText = "";
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
        // Concaténer le texte extrait
        concatenatedText += rawText + "\n\n";
      } catch (error) {
        console.error(`Error extracting text from URL: ${url}`, error);
        continue; // Passer à l'URL suivante en cas d'erreur d'extraction
      }

      // Générer le PDF de la page
      let pdfBuffer;
      try {
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });

        // Vérifier si le PDF est valide
        if (!pdfBuffer || pdfBuffer.length < 1024) {
          throw new Error("Generated PDF is empty or invalid");
        }
      } catch (error) {
        console.error(`Error generating PDF for URL: ${url}`, error);
        continue; // Passer à l'URL suivante en cas d'erreur de génération du PDF
      }

      // Sauvegarder le PDF
      const fileName = `${url.replace(/https?:\/\//, "").replace(/[^\w]/g, "_")}.pdf`;
      const filePath = path.join("uploads", fileName);
      const fullFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullFilePath, pdfBuffer);
      console.log(`PDF saved to ${fullFilePath}`);

      // Ajouter les résultats au tableau
      results.push({
        url,
        rawText,
        filePath: `/${filePath}`,
      });
    }

    await browser.close();

    // Retourner la réponse avec les données collectées
    res.status(200).json({
      success: true,
      data: results,
      concatenatedText,
    });
  } catch (error) {
    console.error("Error processing URLs:", error);
    res.status(500).json({
      error: "Failed to process URLs and extract text.",
      details: error,
    });
  }
}
