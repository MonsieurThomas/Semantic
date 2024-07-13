import React from "react";
import Image from "next/image";
import LoupeDemo from "../public/loupeDemo.png";
import EyeDemo from "../public/EyeDemo.png";
import PaperDemo from "../public/PaperDemo.png";

function Demo() {
  return (
    <div className="flex mx-[100px] my-[0px] h-[85vh] gap-[2px]">
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
            className="w-[60px] mx-auto mt-6 "
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

      <div className="w-1/2 p-4 bg-[#F7F7F8] rounded-[35px]">
        <h1 className="text-2xl font-bold mb-8">
          Réserve une démo de 30mn, gratuite et sans engagement :
        </h1>
        <form className="space-y-4 mx-[50px] bg-white p-10">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              What is your email address?
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md p-1 mb-3 "
              required
            />
          </div>
          <div className="">
            <label
              className="block text-sm font-medium my-2"
              htmlFor="location"
            >
              Where is your company located?
            </label>
            <input
              type="text"
              id="location"
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
                  className="form-radio"
                  required
                />
                <span className="ml-2">500+ employees</span>
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Demo;
