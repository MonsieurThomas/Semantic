import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface UserContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  username: string | null; // Laissez cette propriété si elle est utilisée ailleurs
  setUsername: (username: string | null) => void;
  id: number | null;
  setId: (id: number | null) => void;
  remainingPages: number | null;
  setRemainingPages: (remainingPages: number | null) => void;
  mindMapData: any;
  setMindMapData: (data: any) => void;
  login: (
    token: string,
    user: {
      id: number;
      email: string;
      username: string;
      remainingPages: number;
    }
  ) => void; // Utilise email
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  email: null, // Initialisation de l'email
  setEmail: () => {},
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
  remainingPages: null, // Initialisation à null
  setRemainingPages: () => {},
  mindMapData: null,
  setMindMapData: () => {},
  login: () => {},
  logout: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null); // Ajout de l'état pour l'email
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [remainingPages, setRemainingPages] = useState<number | null>(null);
  const [mindMapData, setMindMapData] = useState<any>(null);

  const login = (
    token: string,
    user: {
      id: number;
      email: string;
      username: string;
      remainingPages: number;
    }
  ) => {
    setCookie(null, "token", token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    setEmail(user.email); // Définir l'email à la connexion
    setUsername(user.username);
    setId(user.id);
    setRemainingPages(user.remainingPages);
  };

  const logout = () => {
    destroyCookie(null, "token");
    setEmail(null); // Réinitialiser l'email lors de la déconnexion
    setId(null);
    setUsername(null);
    setRemainingPages(null);
    setMindMapData(null); 
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
          const response = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data) {
            setId(response.data.id);
            setEmail(response.data.email); // Récupérer l'email du profil
            setUsername(response.data.username); // Définir username
            setRemainingPages(response.data.remainingPages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        email, // Inclure l'email dans le contexte
        setEmail, // Inclure le setter pour l'email
        username,
        setUsername,
        id,
        setId,
        remainingPages,
        setRemainingPages,
        mindMapData,
        setMindMapData,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
