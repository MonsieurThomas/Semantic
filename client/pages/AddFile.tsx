import Image from "next/image";
import React, { useState, useContext } from "react";
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
  const { username } = useContext(UserContext);
  const { prompt } = usePrompt();

  const handleMindMaps = () => {
    router.push("/MindMapping");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAddUrl = () => {
    if (url) {
      setUrlList([...urlList, url]);
      setUrl("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files); // Convert FileList to an array of Files
      setFileList([...fileList, ...newFiles]);
    }
  };

  const handleUrlSubmit = async () => {
    if (urlList.length === 0) {
      console.error("No URLs to send.");
      return "";
    }

    try {
      const response = await axios.post("/api/extract-text-from-urls", {
        urls: urlList,
      });

      if (response.data.success) {
        const rawText = response.data.rawText;
        console.log("Extracted Texts from URLs:", rawText);
        return rawText;
      } else {
        console.error("Failed to extract texts from the URLs.");
        return "";
      }
    } catch (error) {
      console.error("Error processing URLs or GPT-4 text:", error);
      return "";
    }
  };

  const handleFileSubmit = async () => {
    console.log("debut handleFileSubmit");
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "/api/extract-text-from-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const rawText = response.data.rawText;
        // console.log("Extracted Texts from Files:", rawText);
        return rawText;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error extracting text from files:", error);
      return "";
    }
  };

  const handleRemoveUrl = (index: number) => {
    const newUrlList = [...urlList];
    newUrlList.splice(index, 1);
    setUrlList(newUrlList);
  };

  const handleRemoveFile = (index: number) => {
    const newFileList = [...fileList];
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const handleHomepage = () => {
    router.push("/");
  };

  const handleCreateMindMap = async () => {
    const taskId = new Date().getTime().toString();
    router.push({
      pathname: "/LoadingTime",
      query: { taskId },
    });
    console.log("Navigated to /LoadingTime with taskId:", taskId);

    const fileText = await handleFileSubmit();
    const urlText = await handleUrlSubmit();

    const combinedText = `${fileText}\n\n${urlText}`;
    const fileNames = fileList.map((file) => file.name);
    try {
      const gptResponse = await axios.post(
        `/api/process-text-with-gpt?taskId=${taskId}`,
        {
          rawText: combinedText,
          prompt: prompt,
          fileNames,
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
        console.error("Failed to process text with GPT-4.");
      }
    } catch (error) {
      console.error("Error processing text with GPT-4:", error);
    }
  };

  return (
    <div style={{ fontFamily: "Lexend" }}>
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
          </div>
          {/* Debut de url */}
          <div className="flex-1">
            <div className="text-center pb-2 h-[60px]">
              <h1>Copier/Coller vos URL</h1>
            </div>
            <div className="flex flex-col gap-4 justify-start rounded-2xl border-[#FCA310] border-dashed border-2 p-2 h-[250px]">
              <div className="overflow-y-auto w-full">
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
        <button
          className="text-center w-[calc(100%-2rem)] bg-[#FCA310] text-white p-2 font-semibold m-4 rounded-lg"
          onClick={handleCreateMindMap}
          disabled={!username || (!urlList.length && !fileList.length)}
        >
          Créer votre mind map
        </button>
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
