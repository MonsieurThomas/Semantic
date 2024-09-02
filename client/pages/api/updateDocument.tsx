// pages/api/updateDocument.ts
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id, pistacheTab } = req.body;

    try {
      const updatedDocument = await prisma.document.update({
        where: { id: Number(id) },
        data: {
          elements: pistacheTab,
        },
      });

      res.status(200).json(updatedDocument);
      console.log("Fin de course update pistache, tout fonctionne");
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
