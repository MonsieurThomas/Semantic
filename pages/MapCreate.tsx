import React, { useRef, useState, useContext, useEffect } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import { UserContext } from "../src/context/UserContext";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { motion } from "framer-motion";

const MapCreate = () => {
  const fileInputRef = useRef<any>(null);
  const {
    setMindMapData,
    id: userId,
    remainingPages,
  } = useContext(UserContext);
  const router = useRouter();
  const [localPages, setLocalPages] = useState<number | null>(2200);

  const handleCreateMap = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (remainingPages)
    setLocalPages(remainingPages);
    console.log("Dans le useEffect de localpage");
  }, [remainingPages]);

  const handleFileChange = async (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("userId", String(userId || ""));

      // Redirect to LoadingTime immediately
      const taskId = new Date().getTime().toString(); // Unique task ID for this upload
      router.push({
        pathname: "/LoadingTime",
        query: { taskId },
      });

      try {
        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data.success) {
          setMindMapData(uploadResponse.data.openaiResponse);
          // Emit the completion event with document info
          const socket = io();
          socket.emit("complete", {
            id: uploadResponse.data.document.id,
            openaiResponse: uploadResponse.data.openaiResponse,
          });
        } else {
          console.error("Upload failed:", uploadResponse.data);
        }
      } catch (error: any) {
        console.error("Error during file upload:", error.message);
      }
    } else {
      console.error("No files selected");
    }
  };

  const handleButton = () => {
    router.push("/AddFile");
  };

  useEffect(() => {
    console.log(
      `Screen width: ${window.screen.width}px, Screen height: ${window.screen.height}px`
    );
  }, []);

  const handlePrompt = () => {
    router.push("/PromptPirate");
  };

  return (
    <div className="h-[80vh] overflow-hidden relative">
      <div className="absolute left-0 top-0 w-full h-full">
        <video
          className="w-full h-full object-cover object-top transform translate-y-[30px] translate-x-[-4px]"
          src="/NEURONES HOMEPAGE_v1a.mp4"
          autoPlay
          muted
          playsInline
        />
      </div>
      <div className="relative flex flex-col items-center justify-center gap-[40px] 2xl:gap-[50px] w-full h-full">
        <motion.div
          className="relative z-10"
          initial={{ y: "0vh" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="text-6xl 2xl:text-7xl font-bold w-[700px] 2xl:w-[800px] pt-[0px] text-center ">
            Speed up your research with mind maps
          </h1>
        </motion.div>
        <div className="relative flex flex-col items-center z-10">
          {/* <button
            onClick={handlePrompt}
            className="bg-red-600 my-4 text-white p-4 rounded-lg absolute top-[10px] left-[400px] 2xl:left-[550px]"
          >
            Prompt Pirate
          </button> */}
          <button
            onClick={handleButton}
            className="relative text-4xl 2xl:text-[55px] bg-[#FCA311] text-white p-3 font-semibold w-[328px] 2xl:w-[440px] h-[130px] 2xl:h-[170px] rounded-[40px] hover:bg-[#FFE3B7]"
          >
            <h1 className="text-center 2xl:pb-2">Crée ta</h1>
            <h1 className="text-center">mind map</h1>
            <IoMdAddCircle className="absolute top-0 right-5 w-6" />
          </button>

          {userId && (
            <div className="absolute top-[127px] 2xl:top-[167px] z-10 mt-1 text-center overflow-hidden">
              <h4 className="text-[#C8C8C8 font-semibold w-[1000px] mx-auto">
                {localPages} / 2200 pages disponibles{" "}
                <a
                  href="#"
                  className="text-[#FCA311] underline font-semibold cursor-pointer"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const subject = encodeURIComponent(
                      "Sales - Demande d'informations sur Lecteur Rapide"
                    );
                    const body = encodeURIComponent(
                      "Bonjour,\n\nJe souhaiterais en savoir plus sur Lecteur Rapide et comment il peut m'aider dans mon activité.\n\nMerci d'avance."
                    );
                    window.location.href = `mailto:thomas.criou@myscripta.app?subject=${subject}&body=${body}`;
                  }}
                >
                  Lecteur Rapide{" "}
                </a>
                <img
                  src="/logoExpand.png"
                  alt="Expand"
                  className="inline-block w-4 h-4 cursor-pointer"
                />
              </h4>
            </div>
          )}
        </div>
        <div className="relative z-10 mt-4">
          <h3 className="font-semibold text-center 2xl:mt-[30px] w-[750px] 2xl:text-xl">
            Semantic accélère votre recherche d&apos;informations en présentant
            le contenu de vos documents de manière structurée, sous forme de{" "}
            <a
              href={"/MindMapping"}
              className="text-[#FCA311] underline font-semibold cursor-pointer "
            >
              mind maps
            </a>{" "}
            interactives.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MapCreate;
