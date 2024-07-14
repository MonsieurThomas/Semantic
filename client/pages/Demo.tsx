import React, { useState, useEffect } from "react";
import Image from "next/image";
import LoupeDemo from "../public/loupeDemo.png";
import EyeDemo from "../public/EyeDemo.png";
import PaperDemo from "../public/PaperDemo.png";

function Demo() {
  const [docsPerWeek, setDocsPerWeek] = useState(0);
  const [pagesPerDoc, setPagesPerDoc] = useState(0);

  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");

  const handleCancel = () => {
    setEmail("");
    setLocation("");
    setCompanySize("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      location,
      companySize,
    };

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Error sending email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDocsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocsPerWeek(Number(event.target.value));
  };

  const handlePagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagesPerDoc(Number(event.target.value));
  };

  const calculateEarnings = () => {
    return (1 * pagesPerDoc * docsPerWeek) / 60;
  };

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
    <div className="flex mx-[100px] my-[0px] h-[115vh] gap-[2px]">
      <div className="w-1/2  p-6 pt-2 bg-[#F7F7F8] rounded-[35px]">
        <h1 className="text-2xl font-bold w-[400px] ">
          Lisez 3x plus de documents, en 3x moins de temps
        </h1>
        <h2 className="text-xl font-semibold my-4 text-center">
          Ce qu’on propose
        </h2>
        <div className="bg-white px-5">
          <Image
            src={PaperDemo}
            alt="Paper Demo"
            className="w-[50px] mx-auto pt-6"
          />
          <h1 className=" font-bold">Compile n’importe quels documents:</h1>
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
        <h1 className="text-xl font-semibold my-4 text-center">
          This is how much you could earn on Thinkific
        </h1>
        <div className="bg-white p-5">
          <div className="mb-4 flex items-center">
            <input
              type="number"
              id="docsPerWeek"
              value={docsPerWeek}
              onChange={handleDocsChange}
              className="w-[80px] border border-gray-300 rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
              min="0"
            />
            <div className="mx-2">
              <h2 className="block font-medium ">/Documents lus</h2>
              <h2 className="text-sm">par semaine</h2>
            </div>
            <p className="px-4">x</p>
            <input
              type="number"
              id="pagesPerDoc"
              value={pagesPerDoc}
              onChange={handlePagesChange}
              className="w-[80px] border border-gray-300 rounded-md px-2 h-[30px] mr-2 no-scrollbar text-center"
              min="0"
            />
            <div className="mx-2">
              <h2 className="block font-medium">Nombre de pages</h2>
              <h2 className="text-sm">moyen par document</h2>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-center">
              {calculateEarnings().toFixed(2)} heures gagnées par employé par
              mois
            </h2>
          </div>
        </div>
      </div>

      <div className="w-1/2 p-4 bg-[#F7F7F8] rounded-[35px]">
        <h1 className="text-2xl font-bold mb-8">
          Réserve une démo de 30mn, gratuite et sans engagement :
        </h1>
        <form
          className="space-y-4 mx-[50px] bg-white p-10"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              What is your email address?
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-1 mb-3"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium my-2"
              htmlFor="location"
            >
              Where is your company located?
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-1"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">
              What is the size of your company?
            </label>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="companySize"
                  value="0-250"
                  checked={companySize === "0-250"}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="form-radio"
                  required
                />
                <span className="ml-2">0-250 employees</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="companySize"
                  value="250-500"
                  checked={companySize === "250-500"}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="form-radio"
                  required
                />
                <span className="ml-2">250-500 employees</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="companySize"
                  value="500+"
                  checked={companySize === "500+"}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="form-radio"
                  required
                />
                <span className="ml-2">500+ employees</span>
              </label>
            </div>
          </div>
          <div className="flex space-x-4">
            <div
              className="reservio-button-container"
              data-text="Réserver maintenant"
              data-size="large"
              data-color="#FCA311"
              data-url="https://semantic.reservio.com"
            ></div>
            {/* <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Demo;
