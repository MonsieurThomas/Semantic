import React from "react";
import LogoExpand from "../public/logoExpand.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";


const MapCreate = () => {

  const handleCreateMap = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.click();

    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
      
        try {
          const response = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Fichier téléversé avec l'ID :", response.data.id);
        } catch (error:any) {
          console.error("Erreur lors du téléversement du fichier :", error.message);
        }
      } else {
        console.error("Aucun fichier sélectionné");
      }
    };
  };


  return (
    <div className="flex flex-col items-center gap-[50px] mt-[70px]" style={{fontFamily:"Lexend"}}>
      <div>
        <h1 className="text-5xl font-bold w-[600px] text-center">
          Speed Up your research with mind maps
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="text-4xl bg-[#003642] text-white p-3 font-semibold w-[240px] rounded-[40px]"
          onClick={handleCreateMap}
        >
          <h1 className="text-center">Crée ta</h1>
          <h1 className="text-center">mind map</h1>
        </div>
        <h4 className="text-[#C8C8C8] font-semibold text-center w-[1000px]">
          {" "}
          2go maximum{" "}
          <span className="text-[#F67A22] underline font-semibold cursor-pointer">
            Starter{" "}
          </span>
          <Image
            src={LogoExpand}
            alt="Expand"
            className=" inline-block w-4 h-4 cursor-pointer"
          />
        </h4>
      </div>
      <div>
        <h3 className=" font-semibold text-center w-[750px]">
          Semantic accelere votre recherche d&apos;information sur les documents
          Word en presentant leur contenu de maniere structurée sous forme de{" "}
          <span className="text-[#F67A22] underline font-semibold cursor-pointer">
            mind maps
          </span>{" "}
          interactives
        </h3>
      </div>
    </div>
  );
};

export default MapCreate;
