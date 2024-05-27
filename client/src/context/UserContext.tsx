import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the context data
interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: string | null;
  setId: (id: string | null) => void;
}

// Create the context with an empty initial value
export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
});

// Define the provider component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(response => {
        if (response.data) {
          setId(response.data.id);
          setUsername(response.data.username);
        }
      })
      .catch(error => {
        console.error('Failed to fetch profileee:', error);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
