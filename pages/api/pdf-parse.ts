import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
// @ts-ignore
import pdfParse from "pdf-parse";

// Désactiver le bodyParser pour cette route API
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fonction utilitaire pour parser le fichier avec formidable
const parseForm = async (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Parser le formulaire pour obtenir le fichier
      const { files } = await parseForm(req);

      // Vérification du nom du champ de fichier, ici 'files' correspondant au frontend
      const file = files.files && Array.isArray(files.files) ? files.files[0] : files.files;

      // Vérifier si le fichier existe et possède un chemin
      if (!file || !file.filepath) {
        throw new Error("Le fichier est introuvable ou le chemin est manquant.");
      }
      
      // Lire le fichier comme un buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      // Extraire le texte du fichier PDF
      const data = await pdfParse(fileBuffer);
      
      // Calculer le nombre de caractères sans les espaces
      const text = data.text;
      const numChars = text.replace(/\s+/g, '').length; // Compte sans les espaces

      // Retourner le texte extrait et le nombre de caractères
      res.status(200).json({ characters: numChars, text });
    } catch (error) {
      console.error("Erreur lors de l'extraction du texte :", error);
      res.status(500).json({ error: 'Erreur lors de l\'extraction du texte.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
