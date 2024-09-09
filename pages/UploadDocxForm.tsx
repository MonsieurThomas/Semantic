// Dans un fichier, par exemple : components/UploadDocxForm.tsx
import React, { useState } from "react";

const UploadDocxForm = () => {
  const [htmlContent, setHtmlContent] = useState("");

  console.log("On Commence");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // 'file' est le nom de l'input de type fichier dans votre formulaire
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);

      try {
        const response = await fetch("/api/convert-docx-to-html", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setHtmlContent(data.html); // Affichez ou utilisez le HTML comme vous le souhaitez
        } else {
          console.error("Erreur lors de l'envoi du fichier.");
        }
      } catch (error) {
        console.error("Erreur lors de la communication avec l'API", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" name="file" accept=".docx" required />
      <button type="submit">Convertir en HTML</button>
      {/* Optionnel : affichez le contenu HTML converti */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </form>
  );
};

export default UploadDocxForm;
