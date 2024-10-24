import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import axios from "axios";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { parseCookies } from "nookies";
import initializeSocketServer from "../../lib/socketServer";
import dotenv from "dotenv";
import { convertWordToPdf } from "./convert-word-to-pdf"; // Import your conversion function
import { mergePdfs } from "./merge-pdfs"; // Assuming this function merges the PDFs

dotenv.config();

// Extend NextApiRequest to include the files property
interface NextApiRequestWithFiles extends NextApiRequest {
  files: Express.Multer.File[]; // Add the 'files' property
}

// Multer configuration
const storage = multer.diskStorage({
  destination: "./uploads/", // Specify the folder where files will be stored
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// Utility to handle Multer in Next.js API routes
export const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Main process-text-with-gpt function
export default async function processText(
  req: NextApiRequestWithFiles,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("\n\n\n Debut de processText\n");

  try {
    // Use Multer to handle file uploads
    await runMiddleware(req, res, upload.any());

    // Extract the prompt and totalPages from the request body
    const { prompt, totalPages, rawText, fileNames } = req.body;
    const taskId = req.query.taskId;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is missing" });
    }

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid or missing prompt" });
    }

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

    // Processing uploaded files
    const uploadedFiles = req.files; // req.files is available thanks to the extended interface
    console.log("These are uploaded files = ", uploadedFiles);

    // Array to store paths of the processed PDF files
    let pdfFiles: string[] = [];

    // Loop through uploaded files, convert DOCX to PDF, and collect PDF paths
    for (const file of uploadedFiles) {
      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Convert DOCX to PDF
        const pdfPath = await convertWordToPdf(file.path);
        pdfFiles.push(pdfPath.startsWith("/") ? pdfPath : `/${pdfPath}`); // Ensure leading slash
      } else if (file.mimetype === "application/pdf") {
        // Move the original PDF to public/uploads if needed
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const originalPdfPath = path.join(uploadDir, path.basename(file.path));

        if (!fs.existsSync(originalPdfPath)) {
          fs.copyFileSync(file.path, originalPdfPath); // Copy PDF to public/uploads
        }

        // Ensure the path starts with a leading '/'
        pdfFiles.push(
          originalPdfPath.startsWith("/")
            ? originalPdfPath
            : `/${originalPdfPath}`
        );
      }
    }

    console.log("\n2nd api debut: ", pdfFiles, "\n");
    // Once all files are processed, merge PDFs
    const mergedPdfPath = await mergePdfs(pdfFiles); // Assuming you have a mergePdfs function

    // Send the merged PDF path or perform further actions
    console.log("\n2nd api retour: ", mergedPdfPath, "\n");

    // Request OpenAI processing
    const openaiApiKey = process.env.OPENAI_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

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
            content: ` ${prompt} \n\nnb-pages=${totalPages}\n \n\n ${rawText}`,
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

    const { choices } = openAIResponse.data;
    const fileBuffer = await fs.promises.readFile(mergedPdfPath); // Read the merged PDF as a buffer
    const textEntries = Array.isArray(fileNames) ? fileNames : [];

    // Save document details in the database
    const newDocument = await prisma.document.create({
      data: {
        fileData: fileBuffer, // Save the binary data of the PDF
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

    // Emit socket event and send response
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
    res.status(500).json({ error: "Failed to process text and files." });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for multer to handle file uploads
  },
};
