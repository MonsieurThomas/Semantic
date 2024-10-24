import { NextApiRequest, NextApiResponse } from "next";
import PDFMerger from 'pdf-merger-js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import stream from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility function for merging PDF files
export const mergePdfs = async (pdfFiles: string[]): Promise<string> => {
  const merger = new PDFMerger();

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', path.basename(pdfFile));  // Use only the filename
    console.log(`\nProcessing file for merge: ${filePath}\n`);

    try {
      const fileStats = fs.statSync(filePath);
      if (fileStats.size > 0) {
        console.log(`Adding PDF to merger: ${filePath}`);
        await merger.add(filePath);  // Ensure this is awaited
      } else {
        console.error(`Skipping empty file: ${filePath}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error processing file: ${filePath}. Error: ${err.message}`);
      } else {
        console.error(`Unknown error processing file: ${filePath}`);
      }
    }
  }

  const mergedPdfPath = path.join(process.cwd(), 'public', 'uploads', `merged_${Date.now()}.pdf`);
  console.log(`\nSaving merged PDF to: ${mergedPdfPath}\n`);
  await merger.save(mergedPdfPath);  // Ensure this is awaited
  console.log(`\nMerged PDF saved to: ${mergedPdfPath}\n`);
  return mergedPdfPath;
};


const finished = promisify(stream.finished);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const busboy = require('busboy');
    const bb = busboy({ headers: req.headers });

    const pdfFiles: string[] = [];
    const fileWritePromises: Promise<void>[] = [];

    bb.on('file', (_: string, file: any, info: { filename: string }) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');  // Ensure the absolute path is used
      const filePath = path.join(uploadDir, info.filename);  // Use info.filename instead of filename directly
      console.log(`Receiving file: ${info.filename}, saving to ${filePath}`);

      const writeStream = fs.createWriteStream(filePath);
      file.pipe(writeStream);

      const writePromise = finished(writeStream)
        .then(() => {
          console.log(`\nFile successfully written: ${filePath}`);
          pdfFiles.push(info.filename);  // Use just the filename for mergePdfs

          // Check file size
          const fileStats = fs.statSync(filePath);
          if (fileStats.size === 0) {
            console.error(`File ${filePath} is empty`);
          } else {
            console.log(`File ${filePath} has size: ${fileStats.size} bytes`);
          }
        })
        .catch((err) => {
          console.error(`Error writing file: ${filePath}`, err);
        });

      fileWritePromises.push(writePromise);
    });

    bb.on('close', async () => {
      try {
        // Wait for all file writes to finish
        await Promise.all(fileWritePromises);  // Ensure you're waiting for all write promises to finish
        console.log(`\nAll files have been uploaded. Merging the following files: ${JSON.stringify(pdfFiles)}\n`);

        if (pdfFiles.length === 0) {
          console.error("No PDF files were uploaded.");
          return res.status(400).json({ error: "No PDF files were uploaded." });
        }

        // Merge the uploaded PDFs
        const mergedPdfPath = await mergePdfs(pdfFiles);  // Ensure this is awaited
        console.log(`\nMerged PDF successfully saved to: ${mergedPdfPath}\n`);

        // Check if the merged PDF exists and is valid
        const mergedFileStats = fs.statSync(mergedPdfPath);
        if (mergedFileStats.size === 0) {
          console.error("Merged PDF file is empty or was not created.");
          return res.status(500).json({ error: "Merged PDF file is empty or was not created." });
        }

        res.status(200).json({ mergedPdfUrl: `/uploads/${path.basename(mergedPdfPath)}` });
      } catch (error) {
        console.error("\nError merging PDFs:", error);
        res.status(500).json({ error: "Error merging PDFs" });
      }
    });

    req.pipe(bb);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
