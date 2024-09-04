import { useState } from "react";
import { usePrompt } from "../src/context/PromptContext";
import { color } from "framer-motion";

const PromptPirate = () => {
  const { prompt, setPrompt } = usePrompt();
  const [newPrompt, setNewPrompt] = useState(prompt); // On initialise avec le prompt actuel

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewPrompt(event.target.value);
  };

  const updatePrompt = () => {
    setPrompt(newPrompt); // Met à jour le prompt dans le contexte
  };

  return (
    <div>
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
          //   border: "black",
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
      <h1>Prompt actuel :</h1>
      <pre>{prompt}</pre> {/* Affichage du prompt actuel */}
    </div>
  );
};

export default PromptPirate;
