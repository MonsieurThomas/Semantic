import React, { useState } from "react";
import { BiCheck } from "react-icons/bi";

const plans = [
  {
    name: "LE LECTEUR RAPIDE",
    description: "Basic access to the platform",
    price: "49€",
    benefits: ["PDF & WORD"],
    pages: 100,
  },
  {
    name: "L'ANALYSTE",
    description: "For individuals starting out",
    price: "99€",
    benefits: ["PDF & WORD", "BIBLIOTHÈQUE DE MIND MAPS"],
    pages: 400,
  },
  {
    name: "L'ENCYCLOPÉDIE",
    description: "For small teams",
    price: "199€",
    benefits: ["PDF & WORD", "BIBLIOTHÈQUE DE MIND MAPS"],
    pages: 1000,
  },
];

function Offer() {
  const [isMonthly, setIsMonthly] = useState(true);

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };

  return (
    <div className="relative flex flex-col items-center justify-center pt-10" style={{ fontFamily: "Lexend" }}>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src="/bg-semantic.mp4"
        autoPlay
        muted
        playsInline
      />
      <button
        onClick={handleToggle}
        className={`relative flex items-center justify-between w-40 h-10 bg-white border border-black rounded-full cursor-pointer transition-colors duration-300`}
      >
        <span
          className={`absolute left-1 transform transition-transform duration-300 ${
            isMonthly ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            width: "50%",
            height: "90%",
            borderRadius: "99px",
            background: "black",
          }}
        />
        <span
          className={`z-10 w-1/2 text-center ${
            isMonthly ? "text-white" : "text-black"
          }`}
        >
          Monthly
        </span>
        <span
          className={`z-10 w-1/2 text-center ${
            isMonthly ? "text-black" : "text-white"
          }`}
        >
          Annually
        </span>
      </button>

      <div className="grid grid-cols-3 gap-4 mt-8  w-[1100px]">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="relative flex flex-col h-[600px] p-14 bg-[#fff3ed] rounded-xl transition-transform transform hover:scale-105 hover:bg-[#fff9f4]"
          >
            {plan.name === "L'ANALYSTE" && (
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FCA311] text-white text-xl font-semibold px-[20px] py-[2px] rounded-xl"
                style={{ whiteSpace: "nowrap" }}
              >
                Le plus populaire
              </div>
            )}
            <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
            <p className="mt-9 font-bold text-3xl text-center">{plan.price}</p>
            <p className=" font-bold text-lg text-center">/mois/user</p>
            <p className=" border w-[300px] mx-auto mt-5"></p>
            <p className="mt-4 font-bold text-2xl items-start">Inclus</p>

            <ul className="mt-6 space-y-2 h-[60px] ">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-600">
                  <BiCheck />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-bold text-2xl items-start">Jusqu&apos;à</p>
            <p className="mt-5 font-bold text-3xl text-center">
              {plan.pages} PAGES{" "}
            </p>
            <p className="font-bold text-xl text-center">/jour</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offer;
