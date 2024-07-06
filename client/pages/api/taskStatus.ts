import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { taskId } = req.query;

  if (!taskId) {
    return res.status(400).json({ status: "Invalid taskId" });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(taskId) },
      select: { id: true, rawText: true, openaiResponse: true },
    });

    if (!document) {
      return res.status(404).json({ status: "Task not found" });
    }

    let status = "Initializing";
    if (document.rawText) {
      status = "Files Uploaded";
    }
    if (document.rawText && document.openaiResponse) {
      status = "Completed";
    }

    res.status(200).json({ status });
  } catch (error) {
    console.error("Error fetching task status:", error);
    res.status(500).json({ status: "Error fetching task status" });
  }
}
