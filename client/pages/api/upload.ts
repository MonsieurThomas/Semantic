import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import prisma from "../../lib/prisma";
import { IncomingMessage, ServerResponse } from "http";
import { promises as fs } from "fs";
import path from "path";

interface Theme {
  name: string;
  weight: number;
}

// Configure Multer
const upload = multer({ dest: "uploads/" });

// Middleware pour Multer
const uploadMiddleware = upload.array("files");

// Promisify le middleware Multer pour l'utiliser avec async/await
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request received");
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    console.log("Running middleware");
    await runMiddleware(req, res, uploadMiddleware);
    console.log("Middleware complete");

    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const colors = [
      "#EB473D",
      "#1C49A7",
      "#507543",
      "#E6A763",
      "#755591",
      "#FCA618",
      "#1BA024"
    ];

    // Créer des tableaux pour les noms et les poids des fichiers
    const theme: string[] = files.map((file: any) => file.originalname);
    const themeSize: number[] = files.map((file: any) => file.size);

    const color = colors[0]; // Choisir une couleur fixe ou une couleur pour l'ensemble

    // Créer un seul enregistrement dans la base de données avec tous les fichiers combinés
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
      },
    });

    console.log("Document saved:", newDocument);

    res.status(200).json({ success: true, document: newDocument });
  } catch (error: any) {
    console.error("Error during file upload:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser intégré de Next.js
  },
};
