import React, { useState, useEffect } from "react";
import "../styles/style.css";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import profilLogo from "../../../public/profilLogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { fetchUserData, User } from "../../../pages/api/auth/fetchUserData";

function Header() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      setUser(userData);
    };

    getUserData();
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleToFalse = () => {
    setIsExpanded(false);
  };

  return (
    <div className="flex mx-10 items-center py-6" style={{ userSelect: "none" }}>
      <Link href="/">
        <Image src={Logo} alt="Logo" className="w-[300px] hover:cursor-pointer" />
      </Link>
      <div className="relative flex w-full justify-between ml-[100px]">
        <div className="flex items-center hover:cursor-pointer" onClick={handleToggle}>
          <h2 className="font-semibold">Pourquoi Semantic ?</h2>
          <span className={`transform transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-0"}`}>
            <ExpandMoreIcon />
          </span>
        </div>
        {isExpanded && (
          <div className="absolute left-[170px] mt-2 text-sm leading-tight px-2 py-1 rounded-xl bg-[#FCA314] text-white font-medium">
            <p>Nos offres</p>
            <p>Mind mapping</p>
            <p>FAQ</p>
            <p>Contacts</p>
          </div>
        )}
        <div className="flex justify-center text-center gap-[150px]">
          <Link
            href="/CanvasDrawing"
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
            <span className="font-semibold">{user ? user.username : "Invité"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
