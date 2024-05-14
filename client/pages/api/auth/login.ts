// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("debut de api/auth/login.ts")
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  try {
    // Chercher l'utilisateur par son nom d'utilisateur
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    console.log("juste avant bcrypt api/auth/login.ts")
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        console.log("bcrypt error api/auth/login.ts")
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }
    console.log("connection reussi api/auth/login.ts")
    res.status(200).json({ message: "Connexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
