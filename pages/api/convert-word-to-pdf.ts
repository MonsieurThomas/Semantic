import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Utility function to handle the Word to PDF conversion
export const convertWordToPdf = async (filePath: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const originalFileName = path.basename(filePath, path.extname(filePath)); // Get the original file name without extension
  const outputFilePath = path.join(uploadDir, `${originalFileName}.pdf`);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  console.log("Debut de convertWordToPdf:");

  return new Promise((resolve, reject) => {
    // Convert Word to PDF using LibreOffice
    const command = `soffice --headless --convert-to pdf "${filePath}" --outdir "${uploadDir}"`;
    console.log(`Executing command: ${command}`);

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Conversion failed:", stderr);
        return reject(new Error("Conversion failed"));
      }

      console.log("LibreOffice conversion stdout:", stdout);
      console.log(`Checking if the output PDF exists at: ${outputFilePath}`);

      // Check if the output PDF was created
      setTimeout(() => {
        if (!fs.existsSync(outputFilePath)) {
          console.error(`PDF not found after conversion at: ${outputFilePath}`);
          return reject(new Error("PDF not found after conversion"));
        } else {
          console.log(`PDF successfully created at: ${outputFilePath}`);
          resolve(`/uploads/${path.basename(outputFilePath)}`);
        }
      }, 1000); // 1 second delay to ensure the file is written
    });
  });
};
