"use client";

import React, { useState, useContext } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../src/context/UserContext";

function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login error:", data.message);
        setError(data.message);
        return;
      }

      // Update the context with the logged-in user information
      login(data.token, {
        id: data.id,
        email: data.email,
        username: data.username,
        remainingPages: data.remainingPages,
      });
      console.log("data.token = ", data.token);
      console.log("data.id = ", data.id);
      console.log("data.email = ", data.email);
      router.push("/");
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] items-center pt-20 gap-10 2xl:mt-[80px]">
      <form onSubmit={handleSubmit} className="w-[520px] flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre adresse email</h1>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[520px] bg-[#F2F2F2] rounded-lg h-8 p-4 font-medium focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre mot de passe</h1>
          <div className="flex items-center w-[520px] bg-[#F2F2F2] rounded-lg h-8 p-4">
            <input
              type={passwordShown ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-medium bg-[#F2F2F2] w-[480px] focus:outline-none"
              required
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {passwordShown ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-[#FCA310] text-white py-[8px] font-bold w-[170px] mx-auto rounded-xl text-xl"
        >
          Se connecter
        </button>
      </form>
      <div>
        <h3 className="text-[#C8C8C8] font-semibold">
          Veuillez lire attentivement les{" "}
          <Link href={"CGU"} className="text-[#FCA310] underline font-semibold cursor-pointer">
            conditions d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link href={"PolitiqueConfidentialite"} className="text-[#FCA310] underline font-semibold cursor-pointer">
            politique de confidentialite.
          </Link>
        </h3>
        <h3 className="text-[#C8C8C8] font-semibold text-center">
          En continuant, vous indiquez votre accord.
        </h3>
      </div>
      <div className="flex gap-[250px] font-semibold underline">
        <Link href={"/ForgotPassword"} className="cursor-pointer">
          Mot de passe oublié ?
        </Link>
        <Link href="/Auth" className="cursor-pointer">
          <h3>Créer un compte</h3>
        </Link>
      </div>
    </div>
  );
}

export default Login;
