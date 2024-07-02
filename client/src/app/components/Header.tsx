import React, { useState, useContext } from "react";
import "../styles/style.css";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import profilLogo from "../../../public/profilLogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";

function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const { username, logout } = useContext(UserContext);
  const { setUsername: setContextUsername, setId: setContextId } =
    useContext(UserContext);
  const router = useRouter();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleToFalse = () => {
    setIsExpanded(false);
  };

  const handleSignOut = async () => {
    logout();
    router.push("/");
  };

  const handleProfileHover = () => {
    setIsProfileHovered(true);
  };

  const handleProfileLeave = () => {
    setIsProfileHovered(false);
  };

  return (
    <div
      className="flex mx-10 items-center py-6"
      style={{ userSelect: "none" }}
      // style={{ userSelect: "none", fontFamily: "Lexend" }}
    >
      <Link href="/">
        <Image
          src={Logo}
          alt="Logo"
          className="w-[300px] hover:cursor-pointer"
        />
      </Link>
      <div className="relative flex w-full justify-between ml-[100px]">
        <div
          className="flex items-center hover:cursor-pointer"
          onClick={handleToggle}
        >
          <h2 className="font-semibold text-xl">Pourquoi Semantic ?</h2>
          <span
            className={`transform transition-transform duration-300 ${
              isExpanded ? "-rotate-90" : "rotate-0"
            }`}
          >
            <ExpandMoreIcon />
          </span>
        </div>
        {isExpanded && (
          <div className="absolute left-[210px] mt-2 text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium cursor-pointer">
            <Link href="/Offer">
              <p>Nos offres</p>
            </Link>
            <Link href="/MindMapping">
              <p>Mind mapping</p>
            </Link>
            <Link href="/FAQ">
              <p>FAQ</p>
            </Link>
            <Link href="/Contact">
              <p>Contact</p>
            </Link>
          </div>
        )}
        <div className="flex justify-center text-center gap-[150px]">
          <div
            onMouseEnter={handleProfileHover}
            // onMouseLeave={handleProfileLeave}
            className="relative"
          >
            {username ? (
              <div className="flex items-center gap-2">
                <span className=" flex items-center justify-center text-xl font-semibold rounded-full bg-gray-200 w-10 h-10">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <Link href="/Login" className="flex items-center gap-2">
                <Image
                  src={profilLogo}
                  alt="Profile Logo"
                  className="w-[42px] h-[40px] hover:cursor-pointer"
                />
              </Link>
            )}
            {isProfileHovered && (
              <div
                className="absolute right-0 mt-2 w-[150px] text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium cursor-pointer"
                onMouseEnter={handleProfileHover}
                onMouseLeave={handleProfileLeave}
              >
                {username ? (
                  <Link href="/MapChoice">
                  <p>Ma bibliothèque</p>
                </Link>
                  ): (
                    <Link href="/Login">
                    <p>Ma bibliothèque</p>
                  </Link>
                  )}
                {username ? (
                  <p onClick={handleSignOut} className="cursor-pointer">
                    Se déconnecter
                  </p>
                ) : (
                  <Link href="/Login">Se connecter</Link>
                )}
                {router.pathname === "/CanvasDrawing" && (
                  <Link href="/MapChoice">
                    <p>Enregistrer</p>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
