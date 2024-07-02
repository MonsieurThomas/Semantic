import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import prisma from "../../lib/prisma";
import { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";
import axios from "axios";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";
import Prompt from "@/app/utils/Prompt";


dotenv.config();

interface Theme {
  name: string;
  weight: number;
}

interface Paragraph {
  content: string;
  role?: string;
}

const upload = multer({ dest: "uploads/" });
const uploadMiddleware = upload.array("files");

const runMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

function concatenateLongParagraphs(paragraphs: Paragraph[]): string {
  return paragraphs
    .filter((paragraph) => paragraph.content.length > 100 || paragraph.role)
    .map((paragraph) => paragraph.content)
    .join(" ");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request received");
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    console.log("Running middleware in new Upload\n\n\n");
    await runMiddleware(req, res, uploadMiddleware);
    console.log("Middleware complete");

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Extract user ID from token
    const cookies = parseCookies({ req });
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as { userId: number };
      userId = decoded.userId;
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const colors = [
      "#EB473D",
      "#1C49A7",
      "#507543",
      "#E6A763",
      "#755591",
      "#FCA618",
      "#1BA024",
    ];

    const theme: string[] = files.map((file: any) => file.originalname);
    const themeSize: number[] = files.map((file: any) => file.size);

    const timestamp = Date.now();
    const colorIndex = timestamp % colors.length;
    const color = colors[colorIndex];

    const newDocument = await prisma.document.create({
      data: {
        name: files.map((file: any) => file.originalname).join(", "),
        mimeType: files.map((file: any) => file.mimetype).join(", "),
        path: files.map((file: any) => file.path).join(", "),
        size: files.reduce((total: number, file: any) => total + file.size, 0),
        date: new Date(),
        color: color,
        title: "",
        url: "",
        theme: theme,
        themeSize: themeSize,
        page: 0,
        createdAt: new Date(),
        userId: userId, // Include the userId here
      },
    });

    console.log("Document saved:", newDocument);

    if (!process.env.AZURE_ENDPOINT || !process.env.AZURE_API_KEY) {
      throw new Error("Azure endpoint or API key not configured");
    }

    let concatenatedText = "";

    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      const readStream = fs.createReadStream(filePath);
      const endpoint = process.env.AZURE_ENDPOINT;
      const apiKey = process.env.AZURE_API_KEY;
      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );

      const poller = await client.beginAnalyzeDocument(
        "prebuilt-layout",
        readStream
      );
      const result = await poller.pollUntilDone();

      if (!result.paragraphs) {
        throw new Error(`No paragraphs found in document analysis result for file ${file.originalname}`);
      }

      concatenatedText += concatenateLongParagraphs(result.paragraphs) + "\n\n";
    }

    const prompt = Prompt;

    console.log("Debut open ia");
    const openaiApiKey = process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        n: 1,
        stop: null,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `${prompt} this is the text: \n\n\n ${concatenatedText}`,
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
    console.log(
      "OpenAI response choices[0].message.content:",
      choices[0].message.content
    );

    // Update the document with the OpenAI response
    const updatedDocument = await prisma.document.update({
      where: { id: newDocument.id },
      data: {
        openaiResponse: choices[0].message.content,
      },
    });

    res.status(200).json({
      success: true,
      document: updatedDocument,
      openaiResponse: choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Error during file upload:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
