import React, { useEffect, useRef } from "react";
import LogoExpand from "../public/logoExpand.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";

const MapCreate = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Désactiver le défilement sur html et body
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleCreateMap = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("ici");
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response from server:", response.data);
        if (response.data.success && response.data.document) {
          console.log("File uploaded with ID:", response.data.document.id);
        } else {
          console.error("Upload failed:", response.data);
        }
        console.log("Fichier téléversé avec l'ID :", response.data.document.id);
      } catch (error: any) {
        console.error(
          "Erreur lors du téléversement du fichier :",
          error.message
        );
      }
    } else {
      console.error("Aucun fichier sélectionné");
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
        />
        <h4 className="text-[#C8C8C8] font-semibold text-center w-[1000px]">
          {" "}
          2go maximum{" "}
          <Link
            href={"/Offer"}
            className="text-[#F67A22] underline font-semibold cursor-pointer"
          >
            Starter{" "}
          </Link>
          <Image
            src={LogoExpand}
            alt="Expand"
            className=" inline-block w-4 h-4 cursor-pointer"
          />
        </h4>
      </div>
      <div>
        <h3 className=" font-semibold text-center mt-[30px] w-[750px]">
          Semantic accélère votre recherche d&apos;information sur les documents
          Word en presentant leur contenu de manière structurée sous forme de{" "}
          <Link
            href={"/MindMapping"}
            className="text-[#FCA310] underline font-semibold cursor-pointer"
          >
            mind maps
          </Link>{" "}
          interactives.
        </h3>
      </div>
    </div>
  );
};

export default MapCreate;
