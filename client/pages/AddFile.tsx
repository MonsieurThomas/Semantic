import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { GoX } from "react-icons/go";
import axios from "axios";

function AddFile() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState<string[]>([]);

  const handleMindMaps = () => {
    router.push("/MindMapping");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = async () => {
    if (urlList.length === 0) {
      console.error("No URLs to send.");
      return;
    }

    try {
      const response = await axios.post("/api/extract-text-from-urls", {
        urls: urlList, // Send the list of URLs to the backend
      });

      if (response.data.success) {
        const rawText = response.data.rawText;
        console.log("Extracted Texts:", rawText);

        // Send the concatenated text to the GPT-4 API and store the response
        const gptResponse = await axios.post("/api/process-text-with-gpt", {
          rawText, // Send the concatenated text to the backend
        });

        if (gptResponse.data.success) {
          console.log("GPT-4 Response:", gptResponse.data.openaiResponse);
        } else {
          console.error("Failed to process text with GPT-4.");
        }
      } else {
        console.error("Failed to extract texts from the URLs.");
      }
    } catch (error) {
      console.error("Error processing URLs or GPT-4 text:", error);
    }
  };

  const handleAddUrl = () => {
    if (url.trim() !== "") {
      setUrlList((prevUrls) => [...prevUrls, url]);
      setUrl(""); // Clear the input after adding the URL
    }
  };

  return (
    <div style={{ fontFamily: "Lexend" }}>
      <div className="border mx-[300px] mt-12 rounded-xl border-1 border-black">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-3xl flex-1">Ajouter vos fichiers</h1>
          <GoX className="text-4xl m-3" />
        </div>
        <div className="flex justify-between p-4">
          <div>
            <div className="text-center pb-2 h-[60px]">
              <h1>Déposer vos fichiers PDF/Word</h1>
              <h1>Ou cliquer pour parcourir</h1>
            </div>
            <div className="w-[370px] h-[250px] flex justify-center items-center rounded-2xl border-[#FCA310] border-dashed border-2">
              <Image
                src="/CloudLogo.png"
                alt="CloudLogo"
                width={200}
                height={200}
              />
            </div>
          </div>
          <div>
            <div className="text-center pb-2 h-[60px]">
              <h1>Copier/Coller vos URL</h1>
            </div>
            <div className="w-[370px] h-[250px] flex flex-col justify-start rounded-2xl border-[#FCA310] border-dashed border-2 p-2">
              <div className="overflow-y-auto w-full">
                {urlList.map((item, index) => (
                  <p
                    key={index}
                    className="text-sm text-blue-500 underline cursor-pointer"
                  >
                    <a href={item} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                  </p>
                ))}
              </div>
              <div className="flex justify-center items-center mt-2">
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Entrer un URL"
                  className="w-[220px] border-2 px-2 py-1 border-black rounded-xl text-sm text-center font-extralight placeholder-black"
                />
                <button
                  onClick={handleAddUrl}
                  className="ml-2 bg-[#FCA310] text-white p-2 font-semibold rounded-lg"
                >
                  OK
                </button>
              </div>
            </div>

            <button
              onClick={handleUrlSubmit}
              className="mt-4 bg-[#FCA310] text-white p-2 font-semibold rounded-lg"
            >
              Extraire le texte
            </button>
          </div>
        </div>
        <button className="text-center w-[calc(100%-2rem)] bg-[#FCA310] text-white p-2 font-semibold m-4 rounded-lg">
          Créer votre mind map
        </button>
      </div>
      <h1 className="mt-4 mx-[300px] font-semibold text-center">
        Semantic accélère votre recherche d&apos;informations en présentant le
        contenu de vos documents de manière structurée sous forme de{" "}
        <span onClick={handleMindMaps} className="text-[#FCA310]">
          {" "}
          mind maps
        </span>{" "}
        interactives.
      </h1>
    </div>
  );
}

export default AddFile;
