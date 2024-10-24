import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import DocxMerger from "docx-merger";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false, // We'll manually handle file uploads
  },
};

// Function to merge any number of .docx files
async function mergeDocxFiles(filePaths: string[], outputFilePath: string) {
  try {
    const fileContents: string[] = [];

    // Read all the files in binary format
    for (const filePath of filePaths) {
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, "binary");
        fileContents.push(fileContent);
      } else {
        console.error("Invalid file path encountered:", filePath);
        throw new Error("Invalid file path encountered");
      }
    }

    // Initialize DocxMerger with the files' contents
    const docxMerger = new DocxMerger({}, fileContents);

    // Save the merged .docx file
    docxMerger.save("nodebuffer", (data: Buffer) => {
      fs.writeFileSync(outputFilePath, data);
    });

    return outputFilePath;
  } catch (error) {
    console.error("Error merging documents:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Configure formidable
  const form = formidable({
    uploadDir, // Correctly set the upload directory
    keepExtensions: true, // Keep file extensions
    multiples: true, // Allow multiple file uploads
  });

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Parse the incoming form to extract files
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Error parsing the form" });
    }

    try {
      // Log the files for debugging purposes
      console.log("Uploaded files:", files);

      // Collect paths of the uploaded .docx files only
      const filePaths = Object.values(files)
        .flatMap((file: any) => (Array.isArray(file) ? file : [file])) // Handle arrays of files
        .filter((file: File) => file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") // Filter for .docx only
        .map((file: File) => file.filepath) // Extract file paths
        .filter((filePath) => !!filePath);

      if (filePaths.length === 0) {
        console.error("No valid .docx files found for merging.");
        return res.status(400).json({ error: "No valid .docx files uploaded." });
      }

      const outputFilePath = path.join(uploadDir, `${uuidv4()}.docx`);

      // Merge the .docx files
      const mergedFilePath = await mergeDocxFiles(filePaths, outputFilePath);

      // Send back the merged file URL
      res.status(200).json({ mergedFileUrl: `/uploads/${path.basename(mergedFilePath)}` });
    } catch (error) {
      console.error("Error merging files:", error);
      res.status(500).json({ error: "Failed to merge files" });
    }
  });
}
