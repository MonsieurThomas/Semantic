import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import prisma from "../../lib/prisma";
import { IncomingMessage, ServerResponse } from "http";
import { promises as fs } from "fs"; // Importer le module fs

// Configure Multer
const upload = multer({ dest: "uploads/" });

// Middleware pour Multer
const uploadMiddleware = upload.single("file");

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
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  try {
    console.log("Running middleware");
    await runMiddleware(req, res, uploadMiddleware);
    console.log("Middleware complete");

    const file = (req as any).file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { originalname, mimetype, path } = file;

    // Récupérer la taille du fichier
    const stats = await fs.stat(path);
    const fileSizeInBytes = stats.size;

    console.log("Saving file info to the database");
    const newDocument = await prisma.document.create({
      data: {
        name: originalname,
        mimeType: mimetype,
        path: path,
        size: fileSizeInBytes, // Enregistrer la taille du fichier
        date: new Date(),
        color: "",
        title: "",
        url: "",
        theme: [],
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
