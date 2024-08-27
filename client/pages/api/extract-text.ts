import axios from "axios";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Assurez-vous que le chemin vers prisma est correct
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import Prompt from '@/app/utils/Prompt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Début du back");
  const { url } = req.query;

  if (typeof url !== "string") {
    console.log("Invalid URL");
    return res.status(400).json({ error: "Invalid URL" });
  }

  console.log("url = ", url);

  try {
    console.log("avant le axios");

    // Fetch the HTML content from the URL
    const { data } = await axios.get(url);
    console.log("après le axios");

    // Load the HTML into JSDOM
    const dom = new JSDOM(data);
    const document = dom.window.document;

    console.log("après le JSDOM");

    // Extract text from all paragraphs
    const paragraphs = document.querySelectorAll("p");
    const extractedText = Array.from(paragraphs)
      .map((p) => p.textContent)
      .join("\n\n");

    console.log("\n\n\n\n\naprès le JSDOM au milieu\n\n\n\n");

    // Vérification de l'authentification
    const cookies = parseCookies({ req });
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: number };
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Send the extracted text to the OpenAI API
   const prompt = Prompt;

    const openaiApiKey = process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-2024-08-06',
        n: 1,
        stop: null,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'user',
            content: `${prompt} this is the text: \n\n\n ${extractedText}`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const { choices } = openAIResponse.data;

    // Store the result in the database with Prisma
    const newDocument = await prisma.document.create({
      data: {
        name: url,
        mimeType: "text/html",
        path: url,
        size: Buffer.byteLength(extractedText, "utf8"),
        date: new Date(),
        color: "#1C49A7", // Couleur arbitraire, vous pouvez la générer dynamiquement
        title: "",
        url: url,
        theme: [url],
        themeSize: [Buffer.byteLength(extractedText, "utf8")],
        page: 0,
        createdAt: new Date(),
        userId: userId,
        rawText: extractedText, // Storing the raw text
        openaiResponse: choices[0].message.content, // Storing the OpenAI response
      },
    });

    res.status(200).json({
      success: true,
      document: newDocument,
      openaiResponse: choices[0].message.content,
    });
  } catch (error) {
    console.error("Error during processing:", error);
    res.status(500).json({ error: "Failed to process the URL and store data." });
  }
}
