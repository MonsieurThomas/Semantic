import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the context data
interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: string | null;
  setId: (id: string | null) => void;
  mindMapData: any;
  setMindMapData: (data: any) => void;
}

// Create the context with an empty initial value
export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
  mindMapData: null,
  setMindMapData: () => {},
});

// Define the provider component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(response => {
        if (response.data) {
          setId(response.data.id);
          setUsername(response.data.username);
        }
      })
      .catch(error => {
        console.error('Failed to fetch profile:', error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId, mindMapData, setMindMapData }}>
      {children}
    </UserContext.Provider>
  );
};
