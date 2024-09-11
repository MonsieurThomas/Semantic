import Image from "next/image";
import { parseCookies } from "nookies";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { GoX } from "react-icons/go";
import axios from "axios";
import io from "socket.io-client";
import { UserContext } from "../src/context/UserContext";
import { usePrompt } from "../src/context/PromptContext";

function AddFile() {
  const router = useRouter();
  const [fileList, setFileList] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState<string>("");
  const [urlTextMap, setUrlTextMap] = useState<{ [url: string]: string }>({});
  const [docxTextMap, setDocxTextMap] = useState<{
    [fileName: string]: string;
  }>({});
  const [pdfTextMap, setPdfTextMap] = useState<{ [key: string]: string }>({});
  const [docxCharacters, setDocxCharacters] = useState<number>(0);
  const [urlCharacters, setUrlCharacters] = useState<number>(0);
  const [pdfCharacters, setPdfCharacters] = useState<number>(0);
  const [totalCharacters, setTotalCharacters] = useState<number>(0);

  const { login, username, remainingPages } = useContext(UserContext);
  const { prompt } = usePrompt();

  const handleMindMaps = () => {
    router.push("/MindMapping");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Appel de l'API pour extraire du texte d'une URL
  const handleUrlSubmit = async (newUrl: string) => {
    if (!newUrl) {
      console.error("No URL to send.");
      return "";
    }

    try {
      const response = await axios.post("/api/extract-text-from-urls", {
        urls: [newUrl], // Envoyer la nouvelle URL
      });

      if (response.data.success) {
        const rawText = response.data.rawText;
        console.log("Extracted Text from URL:", rawText);
        return rawText;
      } else {
        console.error("Failed to extract text from the URL.");
        return "";
      }
    } catch (error) {
      console.error("Error processing URL:", error);
      return "";
    }
  };

  // Ajout d'une URL et extraction du texte immédiatement
  const handleAddUrl = async () => {
    if (url) {
      setUrlList([...urlList, url]);
      const extractedTextFromUrl = await handleUrlSubmit(url);

      const newExtractedText = extractedText + extractedTextFromUrl;
      setExtractedText(newExtractedText);

      const newCharacters = extractedTextFromUrl.length;
      setUrlCharacters(urlCharacters + newCharacters);
      setTotalCharacters(totalCharacters + newCharacters);

      setUrlTextMap({ ...urlTextMap, [url]: extractedTextFromUrl });
      setUrl("");
    }
  };

  const handleRemoveUrl = (index: number) => {
    const urlToRemove = urlList[index];
    const newUrlList = [...urlList];
    newUrlList.splice(index, 1);
    setUrlList(newUrlList);

    const textToRemove = urlTextMap[urlToRemove] || "";
    const textToRemoveLength = textToRemove.length;

    setUrlCharacters(urlCharacters - textToRemoveLength);
    setTotalCharacters(totalCharacters - textToRemoveLength);

    const { [urlToRemove]: _, ...newUrlTextMap } = urlTextMap;
    setUrlTextMap(newUrlTextMap);

    const newExtractedText = extractedText.replace(textToRemove, "");
    setExtractedText(newExtractedText);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = fileList[index];
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);

    // Vérifier si c'est un DOCX ou un PDF et mettre à jour les compteurs et textes en conséquence
    if (
      fileToRemove.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const textToRemove = docxTextMap[fileToRemove.name] || "";
      const textToRemoveLength = textToRemove.length;

      setDocxCharacters(docxCharacters - textToRemoveLength);
      // setUrlCharacters(urlCharacters - textToRemoveLength);
      setTotalCharacters(totalCharacters - textToRemoveLength);

      const { [fileToRemove.name]: _, ...newDocxTextMap } = docxTextMap;
      setDocxTextMap(newDocxTextMap);

      const newExtractedText = extractedText.replace(textToRemove, "");
      setExtractedText(newExtractedText);
    } else if (fileToRemove.type === "application/pdf") {
      const textToRemove = pdfTextMap[fileToRemove.name] || "";
      const textToRemoveLength = Math.floor(textToRemove.length * 1.18);

      setPdfCharacters(pdfCharacters - textToRemoveLength);
      // setUrlCharacters(urlCharacters - textToRemoveLength);
      setTotalCharacters(totalCharacters - textToRemoveLength);

      const { [fileToRemove.name]: _, ...newPdfTextMap } = pdfTextMap;
      setPdfTextMap(newPdfTextMap);

      const newExtractedText = extractedText.replace(textToRemove, "");
      setExtractedText(newExtractedText);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files); // Convertir FileList en un tableau de fichiers
      setFileList([...fileList, ...newFiles]);

      // Variables locales pour accumuler les valeurs
      let countDocx = 0;
      let countPdf = 0;
      let accumulatedDocxTextMap = { ...docxTextMap }; // Accumuler le texte PDF
      let accumulatedPdfTextMap = { ...pdfTextMap }; // Accumuler le texte PDF

      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("files", file);

        try {
          let response;
          if (
            file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            // Appeler l'API pour les fichiers Word
            response = await axios.post(
              "/api/extract-text-from-files",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response?.data?.success) {
              const extractedTextFromFile = response.data.rawText;

              // Concaténer le texte extrait avec l'existant
              const newExtractedText = extractedText + extractedTextFromFile;
              setExtractedText(newExtractedText);

              // Compter les caractères extraits
              countDocx += extractedTextFromFile.length;
              // setTotalCharacters(totalCharacters + newCharacters);

              // Mettre à jour le compte des caractères DOCX
              accumulatedDocxTextMap[file.name] = extractedTextFromFile;
            }
          } else if (file.type === "application/pdf") {
            response = await axios.post("/api/pdf-parse", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("passage");
            if (response?.data?.text) {
              const extractedTextFromFile = response.data.text;

              // Concaténer le texte extrait avec l'existant
              const newExtractedText = extractedText + extractedTextFromFile;
              setExtractedText(newExtractedText);

              // Accumuler les caractères et le texte PDF
              countPdf += Math.floor(response.data.text.length * 1.18);

              accumulatedPdfTextMap[file.name] = extractedTextFromFile; // Ajouter à la map accumulée
            }
          } else {
            console.error("Échec de l'extraction du texte du fichier.");
          }
        } catch (error) {
          console.error(
            `Erreur lors de l'extraction du texte du fichier ${
              file.type === "application/pdf" ? "PDF" : "DOCX"
            } :`,
            error
          );
        }
      }

      // Mise à jour finale après la boucle
      if (countPdf && countDocx) {
        setTotalCharacters(totalCharacters + countPdf + countDocx);
        setPdfCharacters(pdfCharacters + countPdf);
        setPdfTextMap(accumulatedPdfTextMap); // Mise à jour en une seule fois avec la map accumulée
        setDocxCharacters(pdfCharacters + countDocx);
        setDocxTextMap(accumulatedDocxTextMap); // Mise à jour en une seule fois avec la map accumulée
      } else if (countPdf) {
        setTotalCharacters(totalCharacters + countPdf);
        setPdfCharacters(pdfCharacters + countPdf);
        setPdfTextMap(accumulatedPdfTextMap); // Mise à jour en une seule fois avec la map accumulée
      } else if (countDocx) {
        setTotalCharacters(totalCharacters + countDocx);
        setDocxCharacters(pdfCharacters + countDocx);
        setDocxTextMap(accumulatedDocxTextMap); // Mise à jour en une seule fois avec la map accumulée
      }
    }
  };

  const handleFileSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/api/extract-text-from-docx",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const rawText = response.data.rawText;
        return rawText;
      } else {
        return "";
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'extraction du texte à partir du fichier DOCX :",
        error
      );
      return "";
    }
  };

  const handleHomepage = () => {
    router.push("/");
  };

  const handleCreateMindMap = async () => {
    // Récupérer le token à partir des cookies
    const cookies = parseCookies();
    const token = cookies.token;

    if (!token) {
      console.log("Aucun token trouvé dans les cookies.");
      return;
    } else {
      console.log("Token récupéré depuis le cookie :", token);
    }

    try {
      const pagesToSubtract = Math.ceil(totalCharacters / 3000);
      console.log("pagesToSubtract = ", pagesToSubtract);
      const response = await axios.post(
        "/api/update-remaining-pages",
        { pagesToSubtract },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("token = ", token);

      const taskId = new Date().getTime().toString();
      router.push({
        pathname: "/LoadingTime",
        query: { taskId },
      });
      console.log("Navigated to /LoadingTime with taskId:", taskId);

      const fileNames = fileList.map((file) => file.name);

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file);
      });

      const fileTextResponse = await axios.post(
        "/api/extract-text-from-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (fileTextResponse?.data?.success) {
        const combinedText = fileTextResponse.data.rawText;
        console.log("combinedText avant gpt = ", combinedText);

        // Envoi du texte combiné à GPT
        const gptResponse = await axios.post(
          `/api/process-text-with-gpt?taskId=${taskId}`,
          {
            rawText: combinedText,
            prompt: prompt,
            fileNames,
            totalPages: Math.ceil(totalCharacters / 3000),
          }
        );

        if (gptResponse.data.success) {
          const socket = io();
          console.log("Socket connection established.");
          setTimeout(() => {
            socket.emit("loadingComplete", {
              id: gptResponse.data.document.id,
              openaiResponse: gptResponse.data.openaiResponse,
              taskId: taskId,
            });
            console.log("Emitted loadingComplete event with taskId:", taskId);
          }, 1000);
        } else {
          console.error("Échec du traitement du texte avec GPT.");
        }
      } else {
        console.error("Échec de l'extraction du texte des fichiers.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des pages restantes ou du traitement GPT :",
        error
      );
    }
  };

  return (
    <div style={{ fontFamily: "Lexend" }}>
      <p>Username: {username}</p>
      <p>Remaining Pages: {remainingPages}</p>{" "}
      <div className="border mx-[300px] mt-12 rounded-xl border-1 border-black">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-3xl flex-1">Ajouter vos fichiers</h1>
          <GoX className="text-4xl m-3" onClick={handleHomepage} />
        </div>
        <div className="flex justify-between items-start p-4 gap-x-4">
          <div className="flex-1">
            <div className="text-center pb-2 h-[60px]">
              <h1>Déposer vos fichiers PDF/Word</h1>
              <h1>Ou cliquer pour parcourir</h1>
            </div>
            <div className="flex flex-col gap-4 justify-start rounded-2xl border-[#FCA310] border-dashed border-2 p-2 h-[250px]">
              <div className="overflow-y-auto w-full ">
                <h3>Total des char DOCX : {docxCharacters}</h3>
                <h3>Total des char PDF : {pdfCharacters}</h3>
                {fileList.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm text-blue-500 underline cursor-pointer"
                  >
                    <p>{file?.name}</p>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-black text-xl ml-2"
                    >
                      <GoX />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-start mt-2">
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  multiple
                />
                {fileList.length == 0 ? (
                  <Image
                    className="cursor-pointer"
                    src={"/CloudLogo.png"}
                    alt="Cloud"
                    width={200}
                    height={50}
                    onClick={() => {
                      const fileInput = document.getElementById("fileInput");
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                  />
                ) : (
                  <button
                    onClick={() => {
                      const fileInput = document.getElementById("fileInput");
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    className="bg-[#FCA310] text-white p-2 font-semibold rounded-lg"
                  >
                    Ajouter plus de fichiers
                  </button>
                )}
              </div>
            </div>
            <h3>
              Total des char : {totalCharacters} {"<-- J'enleverais plus tard"}
            </h3>
            <h3>
              Total des pages : {Math.ceil(totalCharacters / 3000)}{" "}
              {"<-- Ca aussi"}
            </h3>
            {/* Faire demo */}
          </div>

          <div className="flex-1">
            <div className="text-center pb-2 h-[60px]">
              <h1>Copier/Coller vos URL</h1>
            </div>
            <div className="flex flex-col gap-4 justify-start rounded-2xl border-[#FCA310] border-dashed border-2 p-2 h-[250px]">
              <div className="overflow-y-auto w-full">
                <h1>Le nombre de char est = {urlCharacters}</h1>
                {urlList.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm text-blue-500 underline cursor-pointer px-1"
                  >
                    <a href={item} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                    <button
                      onClick={() => handleRemoveUrl(index)} // Call the remove function
                      className="text-black text-xl ml-2"
                    >
                      <GoX />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center mt-2 lg:px-[50px]">
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Entrer un URL"
                  className="w-full border-2 px-4 py-1 border-black rounded-xl text-sm text-center font-extralight placeholder-black"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddUrl(); // Call the function to add the URL when Enter is pressed
                    }
                  }}
                />
                <button
                  onClick={handleAddUrl}
                  className="ml-2 bg-[#FCA310] text-white p-2 font-semibold rounded-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-center">
            {Math.ceil(totalCharacters / 3000)} pages, 1 mind map. Simple et
            rapide.
          </h3>
          <button
            className="text-center w-[calc(100%-2rem)] bg-[#FCA310] text-white p-2 font-semibold m-4 rounded-lg"
            onClick={handleCreateMindMap}
            disabled={!username || (!urlList.length && !fileList.length)}
          >
            Créer votre mind map
          </button>
        </div>
      </div>
      <h1 className="my-4 mx-[300px] font-semibold text-center text-l 2xl:text-xl">
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
