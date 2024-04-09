import type { NextApiRequest, NextApiResponse } from 'next';
import mammoth from 'mammoth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Assurez-vous que le chemin est sécurisé et valide pour éviter les vulnérabilités.
  const docxFilePath = "./path/to/your/document.docx";

  mammoth.convertToHtml({ path: docxFilePath })
      .then(result => {
          res.status(200).json({ html: result.value });
      })
      .catch(err => {
          res.status(500).json({ error: err.message });
      });
}