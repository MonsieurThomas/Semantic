import React, { useRef, useContext } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import { UserContext } from "../src/context/UserContext";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { motion } from "framer-motion";

const MapCreate = () => {
  const fileInputRef = useRef<any>(null);
  const { setMindMapData, id: userId } = useContext(UserContext);
  const router = useRouter();

  const handleCreateMap = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleurl = () => {
    router.push("/testUrl");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="absolute top-[0px] left-0 w-full h-ful">
        <video
          className="top-[120px] w-full h-full object-cover"
          src="/NEURONES HOMEPAGE_v1a.mp4"
          autoPlay
          muted
          playsInline
        />
      </div>
      <div className="relative flex flex-col items-center gap-[50px] w-full ">
        <motion.div
          className="relative z-10"
          initial={{ y: "0vh" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h1 className="text-6xl font-bold w-[700px] pt-[60px] text-center ">
            Speed up your research with mind maps
          </h1>
        </motion.div>
        <div className="relative flex flex-col items-center z-10 overflow-hidden">
          <button
            onClick={handleCreateMap}
            className="relative text-4xl bg-[#FCA311] text-white p-3 font-semibold w-[328px] h-[130px] rounded-[40px] hover:bg-[#FFE3B7]"
          >
            <h1 className="text-center">Crée ta</h1>
            <h1 className="text-center">mind map</h1>
            <IoMdAddCircle className="absolute top-2 right-5 w-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          {userId && (
            <div className="absolute top-[130px] text-center ">
              <h4 className="text-[#C8C8C8] font-semibold w-[1000px] mx-auto">
                2go maximum{" "}
                <a
                  href={"/Offer"}
                  className="text-[#FCA311] underline font-semibold cursor-pointer"
                >
                  Starter{" "}
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
          <h3 className="font-semibold text-center mt-[30px] w-[750px]">
            Semantic accélère votre recherche d&apos;informations en présentant
            le contenu de vos documents de manière structurée, sous forme de{" "}
            <a
              href={"/MindMapping"}
              className="text-[#FCA311] underline font-semibold cursor-pointer "
            >
              mind maps
            </a>{" "}
            interactives.
            <button onClick={handleurl}>Handle url</button>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MapCreate;
