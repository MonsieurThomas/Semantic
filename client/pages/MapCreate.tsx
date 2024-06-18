import React, { useEffect } from "react";
import LogoExpand from "../public/logoExpand.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";

const MapCreate = () => {
  useEffect(() => {
    // Désactiver le défilement sur html et body
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Restaurer le défilement lorsque le composant est démonté
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

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
        <Link
          href="/CanvasDrawing"
          className="relative text-4xl bg-[#FCA310] text-white p-3 font-semibold w-[280px] rounded-[40px] hover:bg-[#FFE3B7]"
        >
          <h1 className="text-center">Crée ta</h1>
          <h1 className="text-center">mind map</h1>
          <IoMdAddCircle className="absolute top-2 right-5 w-6" />
        </Link>
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
