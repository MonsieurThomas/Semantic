"use client";

import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";

function Auth() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="flex flex-col  h-[85vh] items-center pt-20 gap-10">
      <div className="w-[450px] flex flex-col gap-1 ">
        <h1 className="font-semibold">Votre adresse e-mail</h1>
        <input
          type="text"
          placeholder="Your email"
          className="w-[450px] bg-[#F2F2F2] rounded-lg h-8 p-4 font-medium focus:outline-none"
        />
      </div>
      <div className="w-[450px] flex flex-col gap-1">
        <h1 className="font-semibold">Votre mot de passe</h1>
        <div className=" flex items-center w-[450px] bg-[#F2F2F2] rounded-lg h-8 p-4 ">
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Your password"
            className=" font-medium bg-[#F2F2F2]  w-[390px] focus:outline-none"
          />
          <button onClick={togglePasswordVisibility}>
            {passwordShown ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
          </button>
        </div>
      </div>
      <Link href="/MapChoice">
        <button className="bg-[#003642] text-white py-[8px] font-bold px-8 rounded-xl text-xl">
          {" "}
          Se Connecter
        </button>
      </Link>
      <div>
        <h3 className="text-[#C8C8C8] font-semibold">
          Veuillez lire attentivement les{" "}
          <span className="text-[#F67A22] underline font-semibold cursor-pointer">
            conditions d&apos;utilisation
          </span>{" "}
          et la{" "}
          <span className="text-[#F67A22] underline font-semibold cursor-pointer">
            politique de confidentialite.
          </span>
        </h3>
        <h3 className="text-[#C8C8C8] font-semibold text-center">
          En continuant, vous indiquez votre accord.
        </h3>
      </div>
      <div className="flex gap-[250px] font-semibold underline">
        <h3>Mot de passe oublié ?</h3>
        <h3>Créer un compte</h3>
      </div>
    </div>
  );
}

export default Auth;
