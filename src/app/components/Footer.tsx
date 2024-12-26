import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="h-[5vh] text-black px-10">
      <div className=" h-[5vh] flex flex-col sm:flex-row justify-between items-center px-[100px] ">
        <div className="flex justify-center gap-4 text-sm font-medium underline">
          <Link href="/CGV">
            <h2 className="hover:underline">CGV</h2>
          </Link>
          <Link href="/CGU">
            <h2 className="hover:underline">CGU</h2>
          </Link>
          <Link href="/MentionsLegales">
            <h2 className="hover:underline">Mentions Légales</h2>
          </Link>
          <Link href="/PolitiqueConfidentialite">
            <h2 className="hover:underline">Politique de Confidentialité</h2>
          </Link>
        </div>

        {/* Section droite : Copyright */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Semantic. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
