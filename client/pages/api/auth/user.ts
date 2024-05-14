import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supposons que vous utilisez des cookies de session pour l'authentification
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Valider le token et récupérer l'ID de l'utilisateur
    const userId = validateToken(token); // Implémentez cette fonction selon votre logique

    // Chercher l'utilisateur par son ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }, // Sélectionner les champs nécessaires
    });

    if (!user) {
        console.log("Dans api/auth/user.ts")
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Exemple de fonction pour valider le token (à implémenter selon votre logique)
function validateToken(token: string): number {
  // Implémentez votre logique de validation de token et retournez l'ID de l'utilisateur
  return 1; // Remplacez ceci par la logique réelle
}
