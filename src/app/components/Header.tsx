import React, { useState, useContext, useEffect, useRef } from "react";
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
  useContext(UserContext);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const pushToDemo = () => {
    router.push("/Demo");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex mx-10 items-center py-6 z-50 h-[15vh]"
      style={{ userSelect: "none" }}
    >
      <Link href="/">
        <Image
          src={Logo}
          alt="Logo"
          className="w-[300px] hover:cursor-pointer z-10"
        />
      </Link>
      <div className="relative flex w-full justify-between ml-[100px] z-10">
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
          <div
            className="absolute left-[210px] mt-2 text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium cursor-pointer"
            ref={dropdownRef}
          >
            <Link href="/MindMapping">
              <p onClick={toggleToFalse}>Mind mapping</p>
            </Link>
            <Link href="/FAQ">
              <p onClick={toggleToFalse}>FAQ</p>
            </Link>
            <Link href="/Contact">
              <p onClick={toggleToFalse}>Contact</p>
            </Link>
          </div>
        )}
        {!username && (
          <button
            onClick={pushToDemo}
            className="bg-[#14213D] text-white font-bold px-8 rounded-2xl"
          >
            Réserver une démo
          </button>
        )}
        <div className="flex justify-center text-center gap-[150px]">
          <div onMouseEnter={handleProfileHover} className="relative">
            {username ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center text-xl font-semibold rounded-full bg-gray-200 w-10 h-10">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <Link href="/Login" className="flex items-center gap-">
                <Image
                  src={profilLogo}
                  alt="Profile Logo"
                  className="w-10 h-10 hover:cursor-pointer"
                />
              </Link>
            )}
            {isProfileHovered && (
              <div
                className="absolute right-0 mt-2 w-[150px] text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium cursor-pointer z-11"
                onMouseEnter={handleProfileHover}
                onMouseLeave={handleProfileLeave}
              >
                {username ? (
                  <Link href="/MapChoice">
                    <p onClick={toggleToFalse}>Ma bibliothèque</p>
                  </Link>
                ) : (
                  <Link href="/Login">
                    <p onClick={toggleToFalse}>Ma bibliothèque</p>
                  </Link>
                )}
                {username ? (
                  <p onClick={handleSignOut} className="cursor-pointer">
                    Se déconnecter
                  </p>
                ) : (
                  <Link href="/Login" onClick={toggleToFalse}>
                    Se connecter
                  </Link>
                )}
                {/* {router.pathname === "/CanvasDrawing" && (
                  <Link href="/MapChoice">
                    <p onClick={toggleToFalse}>Enregistrer</p>
                  </Link>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
