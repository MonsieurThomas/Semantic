import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: number | null;
  setId: (id: number | null) => void;
  remainingPages: number | null; // Ajout de remainingPages
  setRemainingPages: (remainingPages: number | null) => void; // Setter pour remainingPages
  mindMapData: any;
  setMindMapData: (data: any) => void;
  login: (token: string, user: { id: number; username: string, remainingPages: number }) => void; // Modification pour inclure remainingPages dans login
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
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
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [remainingPages, setRemainingPages] = useState<number | null>(null); // Variable d'état pour remainingPages
  const [mindMapData, setMindMapData] = useState<any>(null);

  const login = (token: string, user: { id: number; username: string; remainingPages: number }) => {
    setCookie(null, "token", token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    setUsername(user.username);
    setId(user.id);
    setRemainingPages(user.remainingPages); // Définir remainingPages à la connexion
  };

  const logout = () => {
    destroyCookie(null, "token");
    setUsername(null);
    setId(null);
    setRemainingPages(null); // Réinitialiser remainingPages lors de la déconnexion
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
            setUsername(response.data.username);
            setRemainingPages(response.data.remainingPages); // Récupérer remainingPages du profil
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
        username,
        setUsername,
        id,
        setId,
        remainingPages, // Inclure remainingPages dans le contexte
        setRemainingPages, // Inclure le setter pour remainingPages
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
