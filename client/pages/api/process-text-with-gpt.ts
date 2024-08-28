import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Ensure the path to prisma is correct
import axios from "axios";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import Prompt from "@/app/utils/Prompt";
import dotenv from 'dotenv';
import initializeSocketServer from '../../lib/socketServer';  // Assurez-vous de corriger le chemin d'importation

dotenv.config();

export default async function processText(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { rawText } = req.body;
  const taskId = req.query.taskId; // Assurez-vous que taskId est bien extrait des paramètres de la requête
  console.log("Task ID received:", taskId);

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is missing" });
  }
  console.log("\n\n\n\n\n debut de api gpt \n\n\n\n\n");

  if (typeof rawText !== "string" || rawText.trim() === "") {
    return res.status(400).json({ error: "Invalid or empty text provided" });
  }

  try {
    // Initialiser le serveur Socket.io
    const io = initializeSocketServer(res);

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

    // Logique de génération de couleur
    const colors = ['#EB473D', '#1C49A7', '#507543', '#E6A763', '#755591', '#FCA618', '#1BA024'];
    const timestamp = Date.now();
    const colorIndex = timestamp % colors.length;
    const color = colors[colorIndex];

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
        color: color, // Utilisation de la couleur générée dynamiquement
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

    // Émettre l'événement via Socket.io après la création du document
    io.emit('loadingComplete', {
      id: newDocument.id,
      openaiResponse: choices[0].message.content,
      taskId: taskId,  // Assurez-vous que taskId est passé correctement dans la requête
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
