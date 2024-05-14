"use client";

import React, { useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/router";

function Auth() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      router.push("/MapChoice");
    } else {
      console.log("Dans Auth")
      const errorData = await res.json();
      console.log("Error dans Auth.tsx", errorData.error)
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
          <h1 className="font-semibold">Votre adresse e-mail</h1>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Créer un compte
        </button>
      </form>
    </div>
  );
}

export default Auth;
