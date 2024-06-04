import React from "react";
import LogoExpand from "../public/logoExpand.png";
import Image from "next/image";
import Link from "next/link";

const MapCreate = () => {
  return (
    <div className="flex flex-col items-center gap-[50px] mt-[70px]" style={{fontFamily:"Lexend"}}>
      <div>
        <h1 className="text-5xl font-bold w-[600px] text-center">
          Speed Up your research with mind maps
        </h1>
      </div>
      <div className="flex flex-col items-center">
        <Link
          href="/CanvasDrawing"
          className="text-4xl bg-[#003642] text-white p-3 font-semibold w-[240px] rounded-[40px]"
        >
          <h1 className="text-center">Crée ta</h1>
          <h1 className="text-center">mind map</h1>
        </Link>
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
