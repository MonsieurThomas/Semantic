import axios from "axios";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

export default async function extractTextFromUrls(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urls } = req.body;
  console.log("debut extract-text-from-urls");
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "Invalid or empty URLs array" });
  }

  try {
    let concatenatedText = "";

    for (const url of urls) {
      if (typeof url !== "string") continue; // Skip invalid URLs

      try {
        // Fetch the HTML content from the URL
        const { data } = await axios.get(url);

        // Load the HTML into JSDOM
        const dom = new JSDOM(data);
        const document = dom.window.document;

        // Extract text from all paragraphs
        const paragraphs = document.querySelectorAll("p");
        const extractedText = Array.from(paragraphs)
          .map((p) => p.textContent)
          .join("\n\n");

        // Concatenate the extracted text
        console.log("extractedText", extractedText);
        concatenatedText += extractedText + "\n\n";
      } catch (error) {
        console.error(`Error extracting text from URL (${url}):`, error);
        continue; // Skip this URL and continue with the next one
      }
    }

    res.status(200).json({ success: true, rawText: concatenatedText });
  } catch (error) {
    console.error("Error processing URLs:", error);
    res.status(500).json({ error: "Failed to process URLs and extract text." });
  }
}
