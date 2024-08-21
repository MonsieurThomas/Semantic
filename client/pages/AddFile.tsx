import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { GoX } from "react-icons/go";

function AddFile() {
  const router = useRouter();

  const handleMindMaps = () => {
    router.push("/MindMapping");
  };
  return (
    <div style={{ fontFamily: "Lexend" }}>
      <div className="border mx-[300px] mt-12 rounded-xl border-1 border-black">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-3xl flex-1">Ajouter vos fichiers</h1>
          <GoX className="text-4xl m-3" />
        </div>
        <div className="flex justify-between p-4">
          <div>
            <div className="text-center pb-2 h-[60px]">
              <h1>Deposer vos fichiers PDF/Word</h1>
              <h1>Ou cliquer pour parcourir</h1>
            </div>
            <div className="w-[370px] h-[250px] flex justify-center items-center rounded-2xl border-[#FCA310] border-dashed border-2">
              <Image
                src="/CloudLogo.png"
                alt="CloudLogo"
                width={200}
                height={200}
              />
            </div>
          </div>
          <div>
            <div className="text-center pb-2 h-[60px]">
              <h1>Copier/Coller vos URL</h1>
            </div>
            <div className="w-[370px] h-[250px] flex justify-center items-center rounded-2xl border-[#FCA310] border-dashed border-2">
              <input
                type="text"
                placeholder="Entrer a URL"
                className="w-[110px] border-2 px-2 py-1 border-black rounded-xl text-sm text-center font-extralight placeholder-black"
              />
            </div>
          </div>
        </div>
        <button className="text-center w-[calc(100%-2rem)] bg-[#FCA310] text-white p-2 font-semibold m-4 rounded-lg">
          Créer votre mind map
        </button>
      </div>
      <h1 className="mt-4 border mx-[300px] font-semibold text-center">
        Semantic accélère votre recherche d'informations en présentant le
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
