import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Assurez-vous que cette clé est définie

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pagesToSubtract } = req.body;

  try {
    // Vérifier et décoder le token JWT depuis les headers d'autorisation
    const token = req.headers.authorization?.split(" ")[1]; // Assure-toi que le token est présent
    if (!token) {
      return res.status(401).json({ success: false, error: "Non autorisé" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userId = decoded.userId;

    // Mettre à jour remainingPages
    console.log("\n\n\n\npage to substracte in the backend = ", pagesToSubtract);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        remainingPages: {
          decrement: pagesToSubtract,
        },
      },
    });
    console.log("Remaining Pages after update:", updatedUser.remainingPages);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de remainingPages:", error);
    res.status(500).json({ success: false, error: "Erreur lors de la mise à jour de remainingPages" });
  }
}
