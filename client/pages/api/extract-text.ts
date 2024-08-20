import axios from "axios";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Debut du back");
  const { url } = req.query;

  if (typeof url !== "string") {
    console.log("Invalid URL");
    return res.status(400).json({ error: "Invalid URL" });
  }

  console.log("url = ", url);

  try {
    console.log("avant le axios");

    const { data } = await axios.get(url);
    console.log("apres le axios", data);

    // Load the HTML into JSDOM
    const dom = new JSDOM(data);
    const document = dom.window.document;

    console.log("apres le JSDOM");

    // Extract text from all paragraphs
    const paragraphs = document.querySelectorAll("p");
    const text = Array.from(paragraphs)
      .map((p) => p.textContent)
      .join("\n\n");

    res.status(200).json({ text });
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).json({ error: "Failed to extract text from URL." });
  }
}
