import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Document ID is required" });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document" });
  }
}
