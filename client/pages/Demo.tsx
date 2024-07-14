import React, { useState, useEffect } from "react";
import Image from "next/image";
import LoupeDemo from "../public/loupeDemo.png";
import EyeDemo from "../public/EyeDemo.png";
import PaperDemo from "../public/PaperDemo.png";

function Demo() {
  // const [docsPerWeek, setDocsPerWeek] = useState(0);
  // const [pagesPerDoc, setPagesPerDoc] = useState(0);

  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [docsPerWeek, setDocsPerWeek] = useState<string>("");
  const [pagesPerDoc, setPagesPerDoc] = useState<string>("");

  const handleDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Permet uniquement les nombres
      setDocsPerWeek(value);
    }
  };

  const handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      // Permet uniquement les nombres
      setPagesPerDoc(value);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setLocation("");
    setCompanySize("");
  };

  // const handleDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDocsPerWeek(Number(event.target.value));
  // };

  // const handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPagesPerDoc(Number(event.target.value));
  // };

  const calculateEarnings = () => {
    const pages = Number(pagesPerDoc);
    const docs = Number(docsPerWeek);
    return (1 * pages * docs) / 60;
  };

  const formatTime = (decimalHours: number) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);

    if (minutes === 0) {
      return `${hours} heures`;
    }

    return `${hours} heures et ${minutes} minutes`;
  };

  const earnings = calculateEarnings();

  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src = "https://cdn.reservio.com/widget/button-bundle.js";
    script.async = true;

    // Append the script element to the body
    document.body.appendChild(script);

    // Clean up the script element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex mx-[100px] my-[0px] h-[85vh] gap-[2px]">
      <div className="w-1/2  p-6 pt-2 bg-gray-50 rounded-[35px]">
        {/* <h1 className="text-2xl font-bold w-[400px] ">
          Lisez 3x plus de documents, en 3x moins de temps
        </h1> */}
        <h1 className="text-2xl font-bold my-4 text-center">
          Ce qu’on propose
        </h1>
        <div className="bg-white px-5 rounded-xl">
          <Image
            src={PaperDemo}
            alt="Paper Demo"
            className="w-[50px] mx-auto pt-6"
          />
          <h1 className="font-bold">Compile n’importe quels documents:</h1>
          <h3 className="text-sm mx-auto mt-1">
            Jusqu’à 200 pages de Word, PDF, pages Web stockées et sécurisées,
            d’un seul coup.
          </h3>
          <Image
            src={EyeDemo}
            alt="Eye Demo"
            className="w-[60px] mx-auto mt-4 mb-2 "
          />
          <h1 className="text-lg font-bold ">
            Structure ta pensée en un rien de temps
          </h1>
          <h3 className="text-sm mt-1">
            En moins de 10 secondes, tu as une vision claire de tout leur
            contenu, sans bouger ton doigt de la souris.
          </h3>
          <Image
            src={LoupeDemo}
            alt="Loupe Demo"
            className="w-[50px] mx-auto "
          />
          <h1 className="text-lg font-bold ">
            Trouve plus d’informations, plus rapidement, sans te fatiguer
          </h1>
          <h3 className="text-sm pb-5 mt-1">
            Accède, en 1 clic, à tous les paragraphes qui t’intéressent et
            multiplie par 3 ta productivité, sans jamais t’épuiser.
          </h3>
        </div>
      </div>

      <div className="w-1/2 p-4 bg-gray-50 rounded-[35px]">
        <h1 className="text-2xl font-bold my-4 text-center ">
          Ce que tu gagnes{" "}
        </h1>
        <h1 className="text-xl font-semibold my-4 text-center">
          This is how much you could earn on Thinkific
        </h1>
        <div className="bg-white p-5 rounded-xl">
          <div className="mb-4 flex items-center">
            <input
              type="text"
              id="docsPerWeek"
              value={docsPerWeek}
              onChange={handleDocsChange}
              className="w-[80px]  rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
            />
            <div className="mx-2">
              <h2 className="block font-medium ">/Documents lus</h2>
              <h2 className="text-sm">par semaine</h2>
            </div>
            <p className="px-4">x</p>
            <input
              type="text"
              id="pagesPerDoc"
              value={pagesPerDoc}
              onChange={handlePagesChange}
              className="w-[80px] border border-gray-300 rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
            />
            <div className="mx-2 mb-6">
              <h2 className="block font-medium">Nombre de pages</h2>
              <h2 className="text-sm">moyen par document</h2>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-center ">
              {formatTime(earnings)} gagnées par employé par mois
            </h2>
          </div>
        </div>
        <h1 className="text-2xl font-bold my-8 text-center">
          Réserve une démo!
        </h1>
        <div className="flex space-x-4 items-center justify-center">
          <div
            className="reservio-button-container"
            data-text="Réserver maintenant"
            data-size="large"
            data-color="#FCA311"
            data-url="https://semantic.reservio.com"
          ></div>
        </div>
        <h1 className="font-bold text-center mt-10">
          Gratuite, 30mn, et sans engagement :
        </h1>
      </div>
    </div>
  );
}

export default Demo;
