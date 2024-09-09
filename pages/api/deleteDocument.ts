import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  const { documentId } = req.query;

  const cookies = parseCookies({ req });
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let userId: number;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { userId: number };
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(documentId) },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.userId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this document",
      });
    }

    await prisma.document.delete({
      where: { id: Number(documentId) },
    });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
