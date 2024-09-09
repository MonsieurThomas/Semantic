import React from "react";
import Image from "next/image";
import bg from "../public/bg-contact.png";
import bg2 from "../public/bg-contact2.png";
import bg3 from "../public/bg-contact3.png";

const Contact = () => {
  return (
    <div
      style={{ fontFamily: "Lexend", height: "85vh" }}
      className="relative flex flex-col justify-between items-center"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video
          className="w-full h-full object-cover"
          src="/NEURONES CONTACT_v1a.mp4"
          autoPlay
          muted
          playsInline
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-1/2 text-center p-6 rounded-xl">
        <h1 className="text-5xl font-bold mb-6">Contacte-nous!</h1>
        <p className="text-lg">Une question, un problème, une idée?</p>
        <p>Prends contact avec notre équipe!</p>
      </div>
      <div className="relative z-10 flex w-full h-1/2 gap-8 px-12 rounded-xl">
        <div
          className="flex-1 mb-6 flex flex-col items-center justify-center text-center cursor-pointer relative"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const subject = encodeURIComponent(
              "Sales - Demande d'informations"
            );
            const body = encodeURIComponent(
              "Bonjour,\n\nJe souhaiterais en savoir plus sur Semantic et son intérêt pour mes équipes.\n\nMerci d'avance."
            );
            window.location.href = `mailto:thomas.criou@myscripta.app?subject=${subject}&body=${body}`;
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg.src})`, opacity: 0.2 }}
          ></div>
          <h2 className="text-2xl font-semibold mb-4">Sales</h2>
          <p className="text-lg px-4">
            Prenez contact avec nous pour en savoir plus sur Semantic et son
            intérêt pour vos équipes.
          </p>
        </div>
        <div
          className="flex-1 relative mb-6 flex flex-col items-center justify-center text-center cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const subject = encodeURIComponent(
              "Support - Assistance nécessaire"
            );
            const body = encodeURIComponent(
              "Bonjour,\n\nJ'ai une question concernant le logiciel et j'aimerais obtenir de l'aide.\n\nMerci d'avance."
            );
            window.location.href = `mailto:samuel.calef@hec.edu?subject=${subject}&body=${body}`;
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg.src})`, opacity: 0.2 }}
          ></div>
          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <p className="text-lg px-4">
            Nous sommes là pour vous aider - contactez-nous pour toute question
            relative au logiciel et nous vous trouverons une solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
