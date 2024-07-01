import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: number | null;
  setId: (id: number | null) => void;
  mindMapData: any;
  setMindMapData: (data: any) => void;
  login: (token: string, user: { id: number; username: string }) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
  mindMapData: null,
  setMindMapData: () => {},
  login: () => {},
  logout: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [mindMapData, setMindMapData] = useState<any>(null);

  const login = (token: string, user: { id: number; username: string }) => {
    setCookie(null, "token", token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    setUsername(user.username);
    setId(user.id);
  };

  const logout = () => {
    destroyCookie(null, "token");
    setUsername(null);
    setId(null);
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
