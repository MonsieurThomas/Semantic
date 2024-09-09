import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';
import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're handling it with multer
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
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    let concatenatedText = '';

    for (const file of files) {
      const filePath = path.join(process.cwd(), file.path);
      let extractedText = '';

      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = (await mammoth.extractRawText({ path: filePath })).value;
      } else {
        const readStream = fs.createReadStream(filePath);
        const client = new DocumentAnalysisClient(process.env.AZURE_ENDPOINT!, new AzureKeyCredential(process.env.AZURE_API_KEY!));
        const poller = await client.beginAnalyzeDocument('prebuilt-layout', readStream);
        const result = await poller.pollUntilDone();
        extractedText = result.paragraphs?.map(p => p.content).join('\n\n') || '';
      }

      concatenatedText += extractedText + '\n\n';
    }

    res.status(200).json({ success: true, rawText: concatenatedText });
  } catch (error) {
    console.error("Error extracting text from files:", error);
    res.status(500).json({ error: "Failed to extract text from files." });
  }
}
