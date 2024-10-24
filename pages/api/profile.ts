// pages/api/profile.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        remainingPages: true, // Récupération du champ remainingPages
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Inclure remainingPages dans la réponse
    res.status(200).json({
      id: user.id,
      username: user.username,
      remainingPages: user.remainingPages, // Ajouter remainingPages à la réponse
    });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
