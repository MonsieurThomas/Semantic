"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { UserContext } from '../src/context/UserContext';


function Auth() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUsername: setContextUsername, setId: setContextId } = useContext(UserContext);


  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("JSON.stringify({ username, email, password })", JSON.stringify({ username, email, password }))


      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
    
        if (!res.ok) {
          console.log("erreur Auth.tsx !res.ok")
          const data = await res.json();
          setError(data.message);
          return;
        }
    
        const data = await res.json();
        console.log('User registered dans Auth.tsx:', data);
        setContextUsername(data.username);
        setContextId(data.id);
        router.push('/MapChoice');
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
  };

  return (
    <div className="flex flex-col h-[85vh] items-center pt-20 gap-10" style={{fontFamily:"Lexend"}}>
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
