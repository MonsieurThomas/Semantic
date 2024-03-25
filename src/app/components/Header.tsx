import React from "react";
import "../styles/style.css";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import profilLogo from "../../../public/profilLogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

function Header() {
  return (
    <div className="flex mx-10 items-center py-6">
      <Link href="/">
        <Image
          src={Logo}
          alt="Logo"
          className="w-[300px] hover:cursor-pointer"
        />
      </Link>
      <div className="flex  w-full justify-between ml-[100px]">
        <div className="flex items-center hover:cursor-pointer">
          <h2 className="font-semibold">Pourquoi Semantic ?</h2>
          <span className="">
            <ExpandMoreIcon />
          </span>
        </div>
        <div className="flex justify-center text-center gap-[150px] ">
          <button className="bg-[#F56600] text-white p-2 font-semibold rounded-[14px] hover:cursor-pointer">
            Commencer l&apos;essai gratuit
          </button>
          <Image
            src={profilLogo}
            alt="Logo"
            className="w-[42px] h-[40px] hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
