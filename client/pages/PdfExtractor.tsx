import React, { useState } from 'react';
import axios from 'axios';

const PdfTextExtractor = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = (event:any) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        console.log("Debut extraction")
        if (!file) {
            console.error("Aucun fichier sélectionné.");
            return;
        }
    

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/extract-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setExtractedText(response.data.text);
        } catch (error) {
            console.error("Erreur lors de l'extraction du texte:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Extraire le Texte</button>
            </form>
            {extractedText && <div><h3>Texte Extrait :</h3><p>{extractedText}</p></div>}
        </div>
    );
};

export default PdfTextExtractor;
