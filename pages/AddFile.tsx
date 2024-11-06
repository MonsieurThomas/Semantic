import Image from "next/image";
import { parseCookies } from "nookies";
import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { GoX } from "react-icons/go";
import { FiX } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import axios from "axios";
import io from "socket.io-client";
import { UserContext } from "../src/context/UserContext";
import { usePrompt } from "../src/context/PromptContext";
import { GrDocumentTxt } from "react-icons/gr";

function AddFile() {
  const router = useRouter();
  const [fileList, setFileList] = useState<File[]>([]);
  const [urlList, setUrlList] = useState<File[]>([]);
  const [urlListRawText, setUrlListRawText] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [textArea, setTextArea] = useState<string>("");
  const [showTextArea, setShowTextArea] = useState<boolean>(false);
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
  const [showError, setShowError] = useState(false); // Contrôler l'affichage de l'erreur
  const { prompt } = usePrompt();

  const handleMindMaps = () => {
    router.push("/MindMapping");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = async (newUrl: string) => {
    if (!newUrl) {
      console.error("No URL to send.");
      return { rawText: "", pdfData: "" };
    }

    try {
      const response = await axios.post("/api/extract-text-from-urls", {
        urls: [newUrl],
      });

      console.log("API Response:", response.data);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const { rawText, filePath } = response.data.data[0];
        console.log("Extracted Text from URL:", rawText);
        return { rawText, pdfData: filePath };
      } else {
        console.error(
          "Failed to extract text from the URL. Unexpected response format or no data."
        );
        return { rawText: "", pdfData: "" };
      }
    } catch (error) {
      console.error("Error processing URL:", error);
      return { rawText: "", pdfData: "" };
    }
  };

  const handleAddUrl = async () => {
    if (url) {
      setUrlListRawText([...urlListRawText, url]);
      const extractedTextFromUrl = await handleUrlSubmit(url);

      const newExtractedText = extractedText + extractedTextFromUrl.rawText;
      setExtractedText(newExtractedText);

      const newCharacters = extractedTextFromUrl.rawText.length;
      setUrlCharacters(urlCharacters + newCharacters);
      setTotalCharacters(totalCharacters + newCharacters);

      // Fetch the file from the URL and create a File object
      if (extractedTextFromUrl.pdfData) {
        try {
          const response = await fetch(extractedTextFromUrl.pdfData);
          const blob = await response.blob();
          const fileName = extractedTextFromUrl.pdfData.split("/").pop(); // Extract filename from the URL
          const file = new File([blob], fileName, { type: blob.type });

          // Use the File object to update urlList
          setUrlList([...urlList, file]);
          console.log("This is urllist apres la maj", urlList);
        } catch (error) {
          console.error("Failed to convert URL to File:", error);
        }
      }

      setUrlTextMap({ ...urlTextMap, [url]: extractedTextFromUrl.rawText });
      setUrl("");
    }
  };

  const handleRemoveUrl = (index: number) => {
    console.log("handleRemoveUrl index =", index);

    // Remove URL from urlListRawText
    const urlToRemove = urlListRawText[index];
    const newUrlListRawText = [...urlListRawText];
    newUrlListRawText.splice(index, 1);
    setUrlListRawText(newUrlListRawText);

    // Remove corresponding file from urlList
    const newUrlList = [...urlList];
    newUrlList.splice(index, 1);
    setUrlList(newUrlList);

    // Update character counts and text mapping
    const textToRemove = urlTextMap[urlToRemove] || "";
    const textToRemoveLength = textToRemove.length;

    setUrlCharacters(urlCharacters - textToRemoveLength);
    setTotalCharacters(totalCharacters - textToRemoveLength);

    const { [urlToRemove]: _, ...newUrlTextMap } = urlTextMap;
    setUrlTextMap(newUrlTextMap);

    // Update extractedText
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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement> | FileList
  ) => {
    let files;

    if (e instanceof FileList) {
      files = e;
    } else {
      files = e.target.files;
    }
    if (files) {
      const newFiles = Array.from(files);
      setFileList([...fileList, ...newFiles]);

      let countDocx = 0;
      let countPdf = 0;
      let accumulatedDocxTextMap = { ...docxTextMap };
      let accumulatedPdfTextMap = { ...pdfTextMap };

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

              const newExtractedText = extractedText + extractedTextFromFile;
              setExtractedText(newExtractedText);
              countDocx += extractedTextFromFile.length;

              // Mettre à jour le compte des caractères DOCX
              accumulatedDocxTextMap[file.name] = extractedTextFromFile;
            }
          } else if (file.type === "application/pdf") {
            response = await axios.post("/api/pdf-parse", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            if (response?.data?.text) {
              const extractedTextFromFile = response.data.text;

              const newExtractedText = extractedText + extractedTextFromFile;
              setExtractedText(newExtractedText);

              countPdf += Math.floor(response.data.text.length * 1.18);
              accumulatedPdfTextMap[file.name] = extractedTextFromFile;
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

      if (countDocx > 0) {
        setTotalCharacters((prev) => prev + countDocx);
        setDocxCharacters((prev) => prev + countDocx);
        setDocxTextMap(accumulatedDocxTextMap); // Mise à jour en une seule fois avec la map accumulée
      }

      if (countPdf > 0) {
        setTotalCharacters((prev) => prev + countPdf);
        setPdfCharacters((prev) => prev + countPdf);
        setPdfTextMap(accumulatedPdfTextMap); // Mise à jour en une seule fois avec la map accumulée
      }
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

    const pagesToSubtract = Math.ceil(totalCharacters / 3000);

    if (remainingPages)
      if (remainingPages < pagesToSubtract) {
        setShowError(true);
        return;
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

      const taskId = new Date().getTime().toString();
      router.push({
        pathname: "/LoadingTime",
        query: { taskId },
      });
      const fileNames = [
        ...fileList.map((file) => file.name),
        ...urlListRawText,
      ];

      const pdfFiles = fileList.filter(
        (file) => file.type === "application/pdf"
      );

      let fileTextResponse;
      let docNumber = 1;

      if (pdfFiles.length > 0) {
        const formData = new FormData();
        pdfFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("docNumber", docNumber.toString());
        fileTextResponse = await axios.post(
          "/api/extract-text-from-pdf",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      async function saveTextAsPdf(textArea: string) {
        console.log("On est dans saveTextAsPdf");
        try {
          const response = await fetch("/api/extract-text-from-textArea", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: textArea,
            }),
          });

          const result = await response.json();
          console.log("\n\n\n avant result.success\n\n\n");

          if (result.success) {
            console.log("PDF created at:", result.filePath);
            try {
              // Fetch the PDF from the file path and create a Blob
              const pdfResponse = await fetch(result.filePath);
              const pdfBlob = await pdfResponse.blob();
              const fileName = result.filePath.split("/").pop(); // Extract filename from the file path

              // Create a File object from the Blob
              const pdfFile = new File([pdfBlob], fileName || "document.pdf", {
                type: pdfBlob.type,
              });

              // Use the File object to update urlList
              console.log("PDF File created:", pdfFile);
              return pdfFile;
            } catch (error) {
              console.error("Failed to convert generated PDF to File:", error);
            }
          } else {
            console.error("Failed to create PDF:", result.error);
          }
        } catch (error) {
          console.error("Error saving text as PDF:", error);
        }
      }

      let combinedText = "";

      const calculatePages = (text: string) => {
        return Math.ceil(text.length / 3000);
      };

      // Ajouter les textes des PDF s'ils sont présents
      if (fileTextResponse?.data?.rawText) {
        combinedText += fileTextResponse.data.rawText;
        docNumber = fileTextResponse.data.docNumber;
      }
      // console.log("combinedText après ajout des PDF = ", combinedText);

      // Ajouter les textes des DOCX
      Object.values(docxTextMap).forEach((docxText) => {
        const docxPages = calculatePages(docxText);
        combinedText += `\n Document ${docNumber}\n\n`; // Ajouter le doc-nb avec le nombre de pages
        combinedText += docxText;
        docNumber++; // Incrémenter le compteur de documents
      });

      // Ajouter les textes des URLs
      Object.values(urlTextMap).forEach((urlText) => {
        const urlPages = calculatePages(urlText);
        combinedText += `\n Document ${docNumber}\n`; // Ajouter le doc-nb avec le nombre de pages
        combinedText += urlText;
        docNumber++; // Incrémenter le compteur de documents
      });
      // console.log("combinedText après ajout des URLs = ", combinedText);

      // Ajouter le contenu du textArea
      let textAreaFile;
      if (textArea) {
        console.log(
          "\nOn est dans texteAre au tout debut premiere condition\n"
        );
        // const textAreaPages = calculatePages(textArea);
        textAreaFile = saveTextAsPdf(textArea);
        // combinedText += `\n Document ${docNumber}\n`;
        combinedText += `\n${textArea}`;
      }
      // console.log("combinedText après ajout du textArea = ", combinedText);
      // console.log("\n\n\n\nTexte combiné final = ", combinedText);
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n");

      console.log("urlList:", urlList, "\n");

      console.log(
        `Voila tres exactement ce qui est envoyé a l'api de chatgpt:\n\n\n nb-pages=
        
        \n ${prompt} \n\nnb-pages=${Math.ceil(
          totalCharacters / 3000
        )}\n \n\n ${combinedText}`
      );

      console.log("urlList:", urlList, "\n");

      const formData = new FormData();
      formData.append("rawText", combinedText);
      formData.append("prompt", prompt);
      formData.append("totalPages", String(Math.ceil(totalCharacters / 3000)));

      // Ajouter chaque fichier à FormData
      fileList.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      urlList.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      if (textAreaFile) {
        const resolvedTextAreaFile = await textAreaFile; // Await the promise to get the File object
        if (resolvedTextAreaFile) {
          formData.append("textAreafile", resolvedTextAreaFile); // Append the resolved File to FormData
        }
      }

      const gptResponse = await axios.post(
        `/api/process-text-with-gpt?taskId=${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des pages restantes ou du traitement GPT :",
        error
      );
    }
  };

  const handleIconClick = () => {
    setShowTextArea(true); // Show the textarea when the icon is clicked
  };

  // Function to handle the text change in the textarea
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;

    // Mettre à jour totalCharacters en fonction de la différence entre l'ancien et le nouveau texte
    const diff = newText.length - textArea.length;

    setTextArea(newText); // Met à jour textArea
    setTotalCharacters((prevTotal) => prevTotal + diff); // Met à jour totalCharacters
  };

  // Function to close the textarea
  const handleClose = () => {
    setShowTextArea(false); // Hide the textarea when clicking the close button
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files; // Récupérer les fichiers déposés
    handleFileChange(files); // Appeler handleFileChange directement avec FileList
  };

  return (
    <div className="max-h-[80vh]" style={{ fontFamily: "Lexend" }}>
      {showError && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center p-4"
          onClick={() => setShowError(false)} // Ferme la boîte de dialogue en cliquant sur le fond
        >
          <div
            className="bg-white p-4 rounded-2xl border-2 border-black"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l'intérieur
          >
            <p className="font-bold">
              Vous avez dépassé le nombre de pages proposé par votre offre
              actuelle
            </p>
            <p>
              Réduisez le nombre de pages ou passez à une offre supérieure pour
              continuer. (Contacter le{" "}
              <a href="./Contact" className="text-orange-500 underline">
                support
              </a>{" "}
              pour en savoir plus)
            </p>
          </div>
        </div>
      )}
      {/* <p>Username: {username}</p> */}
      {/* <p>Remaining Pages: {remainingPages}</p>{" "} */}
      <div className="border mx-[300px] rounded-xl border-1 border-black">
        <div className="relative flex justify-between items-center">
          <h1 className="text-center text-3xl flex-1 py-3">
            Ajouter vos fichiers
          </h1>
          <GoX
            className="text-4xl m-3 absolute right-1 top-[1px] cursor-pointer"
            onClick={handleHomepage}
          />
        </div>
        <div className="flex justify-between items-start p-4 gap-x-4">
          <div className="flex-1">
            <div className="text-center pb-2 h-[60px]">
              <h1>Déposer vos fichiers PDF/Word</h1>
              <h1>Ou cliquer pour parcourir</h1>
            </div>
            <div
              className="flex flex-col gap-4 justify-start rounded-2xl border-[#FCA310] border-dashed border-2 p-2 h-[250px]"
              onDragOver={(e) => e.preventDefault()} // Permettre le glisser
              onDrop={handleDrop}
            >
              <div className="overflow-y-auto w-full ">
                {/* <h3>Total des char DOCX : {docxCharacters}</h3> */}
                {/* <h3>Total des char PDF : {pdfCharacters}</h3> */}
                {fileList.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm text-blue-500 underline cursor-pointer"
                  >
                    {/* <p>{file?.name}</p> */}
                    <p className="truncate max-w-[300px] overflow-hidden whitespace-nowrap">
                      {file?.name}
                    </p>
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
            {/* <h3>
              Total des char : {totalCharacters} {"<-- J'enleverais plus tard"}
            </h3>
            <h3>
              Total des pages : {Math.ceil(totalCharacters / 3000)}{" "}
              {"<-- Ca aussi"}
            </h3> */}
            {/* Faire demo */}
          </div>

          <div className="flex-1">
            <h1 className="text-center pb-2 h-[60px]">Copier/Coller vos URL</h1>
            <div className="flex flex-col gap-4 justify-between rounded-2xl border-[#FCA310] border-dashed border-2 p-2 h-[250px]">
              <div className="flex flex-col gap-2 flex-grow overflow-hidden">
                <div className="overflow-y-auto max-h-[120px]">
                  {urlListRawText.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm text-blue-500 underline cursor-pointer px-1 break-words" // Ajouter break-words
                    >
                      <a
                        href={item}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-[300px] overflow-hidden whitespace-nowrap" // Ajouter break-all ici
                      >
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
              <div className="text-3xl flex justify-end mt-4 cursor-pointer">
                <GrDocumentTxt onClick={handleIconClick} />
              </div>

              {showTextArea && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center overflow-"
                  onClick={handleClose} // Fermer si on clique sur l'arrière-plan
                >
                  <div
                    className="bg-white p-4 w-1/3 h-1/2 relative rounded-2xl border-black border-2 translate-x-[100px]"
                    onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans la boîte
                  >
                    <button
                      onClick={handleClose}
                      className="absolute top-2 right-2 text-black"
                    >
                      <FiX size={24} />
                    </button>
                    <textarea
                      className="w-full h-full p-4 text-lg focus:outline-none focus:ring-0 rounded-2xl overflow-y-scroll scrollbar-hide"
                      value={textArea}
                      onChange={handleTextChange}
                      placeholder="Enter your text here..."
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        resize: "none",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-center">
            <h3 className="inline-flex items-center">
              {Math.ceil(totalCharacters / 3000)} pages, 1 mind map. Simple et
              rapide.{" "}
              {!showTextArea && (
                <span className="ml-2 relative group text-xl">
                  <IoInformationCircleOutline />
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 text-sm text-white bg-gray-700 p-2 rounded-lg">
                    Le nombre total de pages est indexé sur le nombre total de
                    caractères, une page = 3000 caractères.
                  </div>
                </span>
              )}
            </h3>
          </div>
          <button
            className="text-center w-[calc(100%-2rem)] bg-[#FCA310] text-white p-2 font-semibold m-4 rounded-lg"
            onClick={handleCreateMindMap}
            disabled={
              !username ||
              (!urlListRawText.length && !fileList.length && !textArea.length)
            }
          >
            Créer votre mind map
          </button>
        </div>
      </div>
      <h1 className="py-4 mx-[300px] font-semibold text-center text-l 2xl:text-xl">
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
