import { useState, ChangeEvent } from "react";
import { usePrompt } from "../src/context/PromptContext";

const PromptPirate = () => {
  const { prompt, setPrompt } = usePrompt(); // Utilisation du contexte existant pour le prompt
  const [newPrompt, setNewPrompt] = useState<string>(prompt); // On initialise avec le prompt actuel
  const [file, setFile] = useState<File | null>(null); // État pour stocker le fichier PDF sélectionné
  const [extractedNumber, setExtractedNumber] = useState<number>(0); // État pour le texte extrait

  // Fonction pour gérer la sélection du fichier
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Assurez-vous que le nom 'file' correspond à l'attente de l'API

    try {
      const response = await fetch("/api/pdf-parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'extraction du texte.");
      }

      const data = await response.json();
      setExtractedNumber(data.characters);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Gestion du changement dans le prompt
  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPrompt(event.target.value);
  };

  // Mise à jour du prompt dans le contexte
  const updatePrompt = () => {
    setPrompt(newPrompt);
  };

  return (
    <div>
      {/* Affichage du texte extrait
      {extractedNumber && (
        <div style={{ marginTop: "20px" }}>
          <h2>Texte extrait :</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{extractedNumber}</pre>
        </div>
      )}

      <div className="border-2 my-10"></div> */}

      <h1>Mettre à jour le prompt :</h1>
      <textarea
        value={newPrompt}
        onChange={handlePromptChange}
        rows={10}
        cols={50}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid",
        }}
      />
      <button
        onClick={updatePrompt}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#FCA311",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Mettre à jour le prompt
      </button>

      <h1 className="text-bold py-4">
        Le type du prompt actuel est : {typeof prompt}
      </h1>
      <h1>Prompt actuel :</h1>
      <pre>{prompt}</pre>
    </div>
  );
};

export default PromptPirate;
