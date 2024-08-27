import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Ensure the path to prisma is correct
import axios from "axios";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import Prompt from "@/app/utils/Prompt";
import dotenv from 'dotenv';

export default async function processText(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { rawText } = req.body;
  console.log("\n\n\n\n\n debut de api gpt \n\n\n\n\n");
  dotenv.config();

  if (typeof rawText !== "string" || rawText.trim() === "") {
    return res.status(400).json({ error: "Invalid or empty text provided" });
  }

  try {
    // Vérification de l'authentification
    const cookies = parseCookies({ req });
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret"
      ) as { userId: number };
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const prompt = Prompt;

    const openaiApiKey = process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
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
            content: `${prompt} this is the text: \n\n\n ${rawText}`,
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
        name: "Concatenated Text from URLs",
        mimeType: "text/plain",
        path: "", // Optional
        size: Buffer.byteLength(rawText, "utf8"),
        date: new Date(),
        color: "#1C49A7", // Arbitrary color, you can generate dynamically
        title: "",
        url: "", // Optional
        theme: [],
        themeSize: [],
        page: 0,
        createdAt: new Date(),
        userId: userId,
        rawText: rawText, // Storing the raw text
        openaiResponse: choices[0].message.content, // Storing the OpenAI response
      },
    });

    res.status(200).json({
      success: true,
      document: newDocument,
      openaiResponse: choices[0].message.content,
    });
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).json({ error: "Failed to process text." });
  }
}
