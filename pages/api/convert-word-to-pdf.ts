import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // To handle file uploads manually
  },
};

// Helper function to write file with a Promise
const writeFile = (file: Readable, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);
    file.pipe(fileStream);

    fileStream.on("finish", () => {
      console.log("File successfully written");
      resolve();
    });

    fileStream.on("error", (err) => {
      console.error("File writing error:", err);
      reject(err);
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const busboy = require("busboy");
    const bb = busboy({ headers: req.headers });

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const fileId = uuidv4();
    const inputFilePath = path.join(uploadDir, `${fileId}.docx`);
    const outputFilePath = path.join(uploadDir, `${fileId}.pdf`);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let fileWrittenPromise: Promise<void> | null = null;

    // Process the uploaded file
    bb.on("file", (_: string, file: Readable) => {
      // Use the helper function to handle file writing with a promise
      fileWrittenPromise = writeFile(file, inputFilePath);
    });

    bb.on("close", async () => {
      if (!fileWrittenPromise) {
        console.error("File was not uploaded properly");
        return res
          .status(500)
          .json({ error: "File was not uploaded properly" });
      }

      try {
        // Wait for the file to be completely written
        await fileWrittenPromise;

        // Convert Word to PDF using LibreOffice
        exec(
          `soffice --headless --convert-to pdf ${inputFilePath} --outdir ${uploadDir}`,
          (err, stdout, stderr) => {
            if (err) {
              console.error("Conversion failed:", stderr);
              return res
                .status(500)
                .json({ error: "Conversion failed", details: err.message });
            }

            console.log("LibreOffice conversion stdout:", stdout);

            // Check if the file exists
            if (!fs.existsSync(outputFilePath)) {
              return res
                .status(500)
                .json({ error: "PDF not found after conversion" });
            }

            // Send the converted PDF URL
            res.status(200).json({ pdfUrl: `/uploads/${fileId}.pdf` });
          }
        );
      } catch (error) {
        console.error("File upload error:", error);
        return res.status(500).json({ error: "File upload failed" });
      }
    });

    bb.on("error", (err: any) => {
      console.error("Busboy error:", err);
      return res
        .status(500)
        .json({ error: "Busboy error", details: err.message });
    });

    req.pipe(bb);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
