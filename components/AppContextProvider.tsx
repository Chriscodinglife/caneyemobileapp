import { User } from 'firebase/auth';
import React, { ReactNode, createContext, useContext, useState } from "react";

type AppContextType = { 
    user: User | null;
    updateUser: (newUser: User | null) => void;
}

type AppContextProviderProps = {
    children: ReactNode
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  const contextValue: AppContextType = {
    user,
    updateUser,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
