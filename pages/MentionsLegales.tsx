"use client";

import Link from "next/link";
import React from "react";

function CGV() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 gap-10 2xl:mt-[80px] bg-[#F2F2F2] px-6">
      <div className="w-full max-w-[800px] bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#14213D] mb-6">
          Mentions Légales
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            Éditeur du site :
          </h2>
          <ul className="text-[#333] leading-7">
            <li>
              <strong>Raison sociale :</strong> SEMANTIC GROUPE
            </li>
            <li>
              <strong>Forme juridique :</strong> Société par actions simplifiée
              (SAS)
            </li>
            <li>
              <strong>Capital social :</strong> 1 000 euros
            </li>
            <li>
              <strong>Siège social :</strong> 105 rue de Longchamp, 92200
              Neuilly-sur-Seine, France
            </li>
            <li>
              <strong>Numéro RCS :</strong> 933 102 667 R.C.S. Nanterre
            </li>
            <li>
              <strong>Directeur de la publication :</strong> M. Thomas Criou
            </li>
            <li>
              <strong>Coordonnées de contact :</strong>
              <ul className="ml-4">
                <li>Adresse e-mail : sprtsemantic@gmail.com</li>
                <li>Numéro de téléphone : 06 19 51 63 63</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            Hébergeur du site :
          </h2>
          <ul className="text-[#333] leading-7">
            <li>
              <strong>Nom :</strong> Render
            </li>
            <li>
              <strong>Adresse :</strong> 655 Montgomery Street, 7th Floor, San
              Francisco, CA 94111, États-Unis
            </li>
            <li>
              <strong>Site web :</strong>{" "}
              <a
                href="https://render.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FCA310] underline"
              >
                https://render.com
              </a>
            </li>
            <li>
              <strong>Adresse e-mail de contact :</strong>{" "}
              <a
                href="mailto:hello@render.com"
                className="text-[#FCA310] underline"
              >
                hello@render.com
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <div>
            <Link href="/CGV" className="text-[#FCA310] underline">
              Les CGV
            </Link>
          </div>
          <Link href="/CGU" className="text-[#FCA310] underline">
            Les CGU
          </Link>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            Cookies :
          </h2>
          <p className="text-[#333] leading-7">
            Lors de la navigation sur notre site{" "}
            <a
              href="https://semantic-epc8.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FCA310] underline"
            >
              https://semantic-epc8.onrender.com
            </a>
            , des cookies peuvent être déposés sur votre navigateur pour
            améliorer votre expérience utilisateur et réaliser des statistiques
            de visites. Vous pouvez gérer vos préférences en matière de cookies
            en consultant notre{" "}
            <a href="/cookies-policy" className="text-[#FCA310] underline">
              Politique de cookies
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            Données personnelles :
          </h2>
          <p className="text-[#333] leading-7">
            Pour en savoir plus sur la gestion de vos données personnelles et
            l&apos;exercice de vos droits, veuillez consulter nos{" "}
            <Link href="/CGU" className="text-[#FCA310] underline">
              Conditions Générales d&apos;Utilisation (CGU)
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#FCA310] mb-4">
            Conditions Générales de Vente (CGV) :
          </h2>
          <p className="text-[#333] leading-7">
            Consultez nos{" "}
            <Link href="/CGV" className="text-[#FCA310] underline">
              Conditions Générales de Vente ici
            </Link>{" "}
            pour connaître les modalités de nos services.
          </p>
        </section>
      </div>
    </div>
  );
}

export default CGV;
