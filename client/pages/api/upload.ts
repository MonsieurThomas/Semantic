import { google } from "googleapis";
import fs from "fs";

// Chemin vers le fichier JSON contenant les clés d'authentification
const KEYFILE_PATH = "../../key_google_drive.json";

// Charger les clés d'authentification depuis le fichier JSON
const keys = require(KEYFILE_PATH);

// Authentifier le client
const auth = new google.auth.GoogleAuth({
  credentials: keys,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

// Créer un client Drive
const drive = google.drive({ version: "v3", auth });

// Téléverser un fichier sur Google Drive
async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "MonFichier.txt", // Nom du fichier sur Google Drive
      },
      media: {
        mimeType: "text/plain", // Type MIME du fichier
        body: fs.createReadStream("../textMap.pdf"), // Chemin vers le fichier local à téléverser
      },
    });
    console.log("Fichier téléversé avec l'ID :", response.data.id);
  } catch (error: any) {
    console.error("Erreur lors du téléversement du fichier :", error.message);
  }
}

uploadFile();
