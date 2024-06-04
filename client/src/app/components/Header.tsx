import React, { useState, useContext } from "react";
import "../styles/style.css";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import profilLogo from "../../../public/profilLogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from '../../context/UserContext';


function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { username, id } = useContext(UserContext);
  const { setUsername: setContextUsername, setId: setContextId } = useContext(UserContext);
  const router = useRouter();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleToFalse = () => {
    setIsExpanded(false);
  };

  const handleSignOut = async () => {
    router.push('/');
    setContextUsername(null);
    setContextId(null);
  };

  return (
    <div className="flex mx-10 items-center py-6" style={{ userSelect: "none", fontFamily:"Lexend" }}>
      <Link href="/">
        <Image src={Logo} alt="Logo" className="w-[300px] hover:cursor-pointer" />
      </Link>
      <div className="relative flex w-full justify-between ml-[100px]">
        <div className="flex items-center hover:cursor-pointer" onClick={handleToggle}>
          <h2 className="font-semibold text-xl">Pourquoi Semantic ?</h2>
          <span className={`transform transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-0"}`}>
            <ExpandMoreIcon />
          </span>
        </div>
        {isExpanded && (
          <div className="absolute left-[200px] mt-2 text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium cursor-pointer">
            <Link href="/Offer"><p>Nos offres</p></Link>
            <Link href="/MindMapping"><p>Mind mapping</p></Link>
            <Link href="/FAQ"><p>FAQ</p></Link>
            <Link href="/Contact"><p>Contact</p></Link>
          </div>
        )}
        <div className="flex justify-center text-center gap-[150px]">
          <Link
            href="/MapCreate"
            onClick={toggleToFalse}
            className="bg-[#F56600] text-white p-2 font-semibold rounded-[14px] hover:cursor-pointer"
          >
            Commencer l&apos;essai gratuit
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src={profilLogo}
              alt="Profile Logo"
              className="w-[42px] h-[40px] hover:cursor-pointer"
            />
            {    (
              <button onClick={handleSignOut} className="ml-4 bg-red-500 text-white p-2 rounded-lg">
                Déconnexion
              </button>
            )}
            {username ? username: "no username"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
