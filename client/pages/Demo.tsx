import React, { useState, useEffect } from "react";
import Image from "next/image";
import LoupeDemo from "../public/loupeDemo.png";
import EyeDemo from "../public/EyeDemo.png";
import PaperDemo from "../public/PaperDemo.png";

function Demo() {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [docsPerWeek, setDocsPerWeek] = useState<string>("");
  const [pagesPerDoc, setPagesPerDoc] = useState<string>("");

  const handleDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setDocsPerWeek(value);
    }
  };

  const handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setPagesPerDoc(value);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setLocation("");
    setCompanySize("");
  };

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

    if (hours === 0) {
      return `${minutes} minutes`;
    }

    return `${hours} heures et ${minutes} minutes`;
  };

  const earnings = calculateEarnings();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.reservio.com/widget/button-bundle.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative flex px-[100px] my-[0px] w-full h-[85vh] gap-[2px] z-0">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/NEURONES MINDMAPPING_v1a.mp4"
          autoPlay
          muted
          playsInline
        />
      </div>
      <div className="w-1/2 p-6 pt-2 rounded-[35px] z-10 bg-opacity-75 ">
        <h1 className="text-2xl font-bold my-3 text-center">
          Ce qu’on propose
        </h1>
        <div className="px-5 rounded-xl">
          <Image
            src={PaperDemo}
            alt="Paper Demo"
            className="w-[45px] mx-auto mt-4 mb-6 pt-6"
          />
          <h1 className="font-bold">Compile tes documents</h1>
          <h3 className="text-sm mx-auto mt-1">
            Jusqu’à 200 pages de Word, PDF, pages Web stockées et sécurisées,
            d’un seul coup.
          </h3>
          <Image
            src={EyeDemo}
            alt="Eye Demo"
            className="w-[50px] mx-auto mt-8 mb-6 "
          />
          <h1 className="text-lg font-bold ">Structure ta pensée</h1>
          <h3 className="text-sm mt-1">
            En moins de 10 secondes, tu as une vision claire de tout leur
            contenu, sans bouger ton doigt de la souris.
          </h3>
          <Image
            src={LoupeDemo}
            alt="Loupe Demo"
            className="w-[45px] mx-auto mt-4 mb-6 "
          />
          <h1 className="text-lg font-bold ">
            Trouve 3x plus d’informations en 3x moins de temps
          </h1>
          <h3 className="text-sm pb-5 mt-1">
            Accède, en 1 clic, à tous les paragraphes qui t’intéressent et
            décuple dès maintenant ta productivité.
          </h3>
        </div>
      </div>

      <div className="w-1/2 p-6 pt-2 rounded-[35px]  bg-opacity-75 z-10">
        <h1 className="text-2xl font-bold my-4 text-center ">
          Ce que tu gagnes{" "}
        </h1>
        {/* <h1 className="text-xl font-semibold my-4 text-center">
          This is how much you could earn on Thinkific
        </h1> */}
        <div className=" p-5 py-14 rounded-xl">
          <div className="mb-10 flex items-center">
            <input
              type="text"
              id="docsPerWeek"
              value={docsPerWeek}
              onChange={handleDocsChange}
              className="w-[80px] border border-gray-300 rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
              style={{ outline: "none" }}
            />
            <div className="mx-2">
              <h2 className="block font-medium whitespace-nowrap">
                Documents lus
              </h2>
              <h2 className="text-sm whitespace-nowrap">(par semaine)</h2>
            </div>
            <p className="px-4">x</p>
            <input
              type="text"
              id="pagesPerDoc"
              value={pagesPerDoc}
              onChange={handlePagesChange}
              className="w-[80px] border border-gray-300 rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
              style={{ outline: "none" }}
            />
            <div className="mx-2">
              <h2 className="block font-medium whitespace-nowrap">
                Nombre de pages moyen
              </h2>
              <h2 className="text-sm whitespace-nowrap">(par document)</h2>
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
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const subject = encodeURIComponent("Réservation pour une démo Semantic");
              const body = encodeURIComponent("Bonjour,\n\nJe souhaiterais réserver un créneau pour une démo Semantic.\n\nMerci.\n\n(Messieurs je vous invite a me dire ce que vous voulez voir ecrit ici)");
              window.location.href = `mailto:r.thomas06200@gmail.com?subject=${subject}&body=${body}`;
            }}
            style={{ cursor: 'pointer' }}
          >
            Réserver maintenant
          </div>
        </div>
        <h1 className="font-bold text-center mt-10">
          Gratuite, en moins de 30 min et sans engagement
        </h1>
      </div>
    </div>
  );
}

export default Demo;
