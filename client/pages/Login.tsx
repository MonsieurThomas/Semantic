"use client";

import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../src/context/UserContext";

function Login() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      setUser({ username: userData.username }); // Assuming the API returns the username in the response
      router.push("/MapChoice");
    } else {
      console.log("Dans Login")
      const errorData = await res.json();
      setError(errorData.error);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] items-center pt-20 gap-10">
      <form onSubmit={handleSubmit} className="w-[450px] flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre nom d&apos;utilisateur</h1>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[450px] bg-[#F2F2F2] rounded-lg h-8 p-4 font-medium focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">Votre mot de passe</h1>
          <div className="flex items-center w-[450px] bg-[#F2F2F2] rounded-lg h-8 p-4">
            <input
              type={passwordShown ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-medium bg-[#F2F2F2] w-[390px] focus:outline-none"
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
          className="bg-[#003642] text-white py-[8px] font-bold px-8 rounded-xl text-xl"
        >
          Se Connecter
        </button>
      </form>
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
        <Link href="/Auth">
          <h3>Créer un compte</h3>
        </Link>
      </div>
    </div>
  );
}

export default Login;
