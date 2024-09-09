// src/context/PromptContext.tsx
import React, { createContext, useContext, ReactNode, useState } from "react";
import Prompt from "@/app/utils/Prompt";

// Crée le type pour ton contexte
interface PromptContextProps {
  prompt: string;
  setPrompt: (newPrompt: string) => void;
}

// Initialise le contexte avec le fichier Prompt comme valeur par défaut
const PromptContext = createContext<PromptContextProps | undefined>(undefined);

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [prompt, setPrompt] = useState(Prompt);

  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};

// Hook pour utiliser le contexte dans les composants
export const usePrompt = (): PromptContextProps => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};
