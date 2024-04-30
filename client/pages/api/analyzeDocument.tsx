import { NextApiRequest, NextApiResponse } from 'next';
const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    require('dotenv').config();
    const endpoint = process.env.AZURE_ENDPOINT2;
    const apiKey = process.env.AZURE_API_KEY2;
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    // Expecting filePath to be sent in the request body for security and flexibility
    const { filePath } = req.body;
    console.log("this is filepath in the back = ", filePath)
    try {
        const readStream = fs.createReadStream(filePath);
        console.log("read")
        const poller = await client.beginAnalyzeDocument("prebuilt-layout", readStream);
        const result = await poller.pollUntilDone();
        console.log("this is result in the back = ", result)
        res.status(200).json({ figures: result.figures, result });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}
