// pages/api/convert-docx.ts
import type { NextApiRequest, NextApiResponse } from "next";
import * as mammoth from "mammoth";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const docxFilePath = path.resolve("./public/Feuilletage.docx"); // Assurez-vous que le chemin est correct

  mammoth
    .convertToHtml({ path: docxFilePath })
    .then((result) => {
      const htmlWithoutImages = result.value.replace(/<img[^>]*>/g, ""); // retirer les images
      res.status(200).json({ html: htmlWithoutImages });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
}
