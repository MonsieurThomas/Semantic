import { NextApiRequest, NextApiResponse } from "next";
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("ici analyzeDocument");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const endpoint = process.env.AZURE_ENDPOINT;
  const apiKey = process.env.AZURE_API_KEY;

  if (!endpoint || !apiKey) {
    res.status(500).json({ error: "Azure endpoint or API key not configured" });
    return;
  }

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

  const { filePath } = req.body;
  console.log("this is filepath in the back =", filePath);

  const absoluteFilePath = path.join(process.cwd(), filePath);

  try {
    if (!fs.existsSync(absoluteFilePath)) {
      throw new Error(`File not found: ${absoluteFilePath}`);
    }

    const readStream = fs.createReadStream(absoluteFilePath);
    console.log("read");

    const poller = await client.beginAnalyzeDocument("prebuilt-layout", readStream);
    const result = await poller.pollUntilDone();
    console.log("this is result in the back =", result);

    res.status(200);
  } catch (error: any) {
    console.error("Error during file analysis:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
