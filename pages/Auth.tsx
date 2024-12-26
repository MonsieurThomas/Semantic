"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { UserContext } from "../src/context/UserContext";
import Link from "next/link";

const Auth = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password != "testsemantic") return;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed");
        return;
      }

      const data = await res.json();
      const { token, user } = data;
      login(token, user);
      console.log("Dans auth.tsx login vient de fonctionner avec");
      console.log("token = ", token);
      console.log("user = ", user);

      router.push("/");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] items-center justify-start pt-8 gap-6">
      <form onSubmit={handleSubmit} className="w-[520px] flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre nom d&apos;utilisateur</h1>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[520px] bg-[#F2F2F2] rounded-lg h-8 p-4 font-medium focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre adresse e-mail</h1>
          <input
            type="email"
            placeholder="Your email"
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
              placeholder="Your password"
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
          Créer un compte
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
        <Link href="/Login" className="cursor-pointer">
          <h3>Se connecter</h3>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
