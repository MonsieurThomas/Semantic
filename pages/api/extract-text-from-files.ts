import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req: IncomingMessage, res: ServerResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function extractTextFromFiles(req: NextApiRequest, res: NextApiResponse) {
  try {
    await runMiddleware(req, res, upload.array('files'));

    const files = (req as any).files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun fichier téléchargé' });
    }

    let concatenatedText = '';

    for (const file of files) {
      // Vérification du type MIME pour ne traiter que les fichiers Word
      if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        continue; // Ignorer les fichiers non Word
      }

      const filePath = path.join(process.cwd(), file.path);
      const extractedText = (await mammoth.extractRawText({ path: filePath })).value;

      concatenatedText += extractedText + '\n\n';
    }

    if (concatenatedText === '') {
      return res.status(400).json({ success: false, message: 'Aucun fichier Word trouvé' });
    }

    res.status(200).json({ success: true, rawText: concatenatedText });
  } catch (error) {
    console.error('Erreur lors de l\'extraction du texte des fichiers :', error);
    res.status(500).json({ error: 'Échec de l\'extraction du texte des fichiers.' });
  }
}
