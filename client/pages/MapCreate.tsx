import React, { useRef, useContext } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";
import { UserContext } from "../src/context/UserContext";
import { useRouter } from "next/router";
import io from "socket.io-client";

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

  return (
    <div
      className="flex flex-col items-center gap-[50px] pt-[70px]"
      style={{ overflow: "hidden" }}
    >
      <div>
        <h1 className="text-6xl font-bold w-[700px] text-center">
          Speed up your research with mind maps
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={handleCreateMap}
          className="relative text-4xl bg-[#FCA310] text-white p-3 font-semibold w-[280px] rounded-[40px] hover:bg-[#FFE3B7]"
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
          multiple // Allow multiple file selection
        />
        <h4 className="text-[#C8C8C8] font-semibold text-center w-[1000px]">
          2go maximum{" "}
          <a
            href={"/Offer"}
            className="text-[#F67A22] underline font-semibold cursor-pointer"
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
      <div>
        <h3 className="font-semibold text-center mt-[30px] w-[750px]">
          Semantic accélère votre recherche d&apos;information sur les documents
          Word en presentant leur contenu de manière structurée sous forme de{" "}
          <a
            href={"/MindMapping"}
            className="text-[#FCA310] underline font-semibold cursor-pointer"
          >
            mind maps
          </a>{" "}
          interactives.
        </h3>
      </div>
    </div>
  );
};

export default MapCreate;
