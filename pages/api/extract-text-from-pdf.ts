import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";

const upload = multer({ dest: "uploads/" });

export const config = {
  api: {
    bodyParser: false, // Désactiver l'analyse du corps, car nous utilisons multer
  },
};

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

const calculatePages = (text: string) => {
  return Math.ceil(text.length / 3000); // Calcule le nombre de pages
};

export default async function extractTextFromFiles(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runMiddleware(req, res, upload.array("files"));

    const files = (req as any).files;
    let docNumber = parseInt(req.body.docNumber, 10) || 1; // Récupérer le docNumber de la requête ou initialiser à 1

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    let concatenatedText = "";

    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      let extractedText = "";

      if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Gestion pour les fichiers DOCX (non inclus ici)
      } else {
        const readStream = fs.createReadStream(filePath);
        const client = new DocumentAnalysisClient(
          process.env.AZURE_ENDPOINT!,
          new AzureKeyCredential(process.env.AZURE_API_KEY!)
        );
        const poller = await client.beginAnalyzeDocument(
          "prebuilt-layout",
          readStream
        );
        const result = await poller.pollUntilDone();
        extractedText =
          result.paragraphs?.map((p) => p.content).join("\n\n") || "";
      }

      const pdfPages = calculatePages(extractedText); // Calculer le nombre de pages du PDF
      concatenatedText += `doc-nb-${docNumber}-${pdfPages}\n\n`; // Ajouter le doc-nb-x avec le nombre de pages
      concatenatedText += extractedText + "\n\n";

      docNumber++; // Incrémenter le numéro de document après chaque fichier traité
    }

    // Renvoyer le texte concaténé et le numéro de document mis à jour
    res.status(200).json({ success: true, rawText: concatenatedText, docNumber });
  } catch (error) {
    console.error("Error extracting text from files:", error);
    res.status(500).json({ error: "Failed to extract text from files." });
  }
}
