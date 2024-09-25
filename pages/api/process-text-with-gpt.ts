import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // Assurez-vous que le chemin vers prisma est correct
import axios from "axios";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import Prompt from "@/app/utils/Prompt";
import dotenv from "dotenv";
import initializeSocketServer from "../../lib/socketServer"; // Assurez-vous que le chemin est correct

dotenv.config();

export default async function processText(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { rawText, fileNames, prompt, totalPages } = req.body;
  const taskId = req.query.taskId;

  console.log("Task ID received:", taskId);
  console.log("This is prompt = ", prompt);
  console.log("This is typeof prompt = ", typeof prompt);

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is missing" });
  }

  if (typeof rawText !== "string" || rawText.trim() === "") {
    return res.status(400).json({ error: "Invalid or empty text provided" });
  }

  try {
    const io = initializeSocketServer(res);
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

    // Color logic
    const colors = [
      "#EB473D",
      "#1C49A7",
      "#507543",
      "#E6A763",
      "#755591",
      "#FCA618",
      "#1BA024",
    ];
    const colorIndex = Date.now() % colors.length;
    const color = colors[colorIndex];

    // OpenAI request
    const openaiApiKey = process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Log prompt and make sure it's being sent correctly
    // console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n");
    // console.log(`Voila tres exactement ce qui est envoyé a l'api de chatgpt:\n\n\n nb-pages=${totalPages}\n ${prompt} this is the text: \n\n ${rawText}`);

    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-2024-08-06",
        n: 1,
        stop: null,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `nb-pages=${totalPages}\n ${prompt} this is the text: \n\n ${rawText}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const { choices } = openAIResponse.data;

    // Process fileNames as string array
    const textEntries = Array.isArray(fileNames) ? fileNames : [];

    console.log("Text entries: ", textEntries);

    // Store in the database
    const newDocument = await prisma.document.create({
      data: {
        name: "Concatenated Text from URLs",
        mimeType: "text/plain",
        path: "",
        size: Buffer.byteLength(rawText, "utf8"),
        date: new Date(),
        color: color,
        title: "",
        url: "",
        theme: [],
        themeSize: [],
        page: 0,
        createdAt: new Date(),
        userId: userId,
        rawText: rawText,
        openaiResponse: choices[0].message.content,
        texts: textEntries,
      },
    });

    io.emit("loadingComplete", {
      id: newDocument.id,
      openaiResponse: choices[0].message.content,
      taskId: taskId,
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
