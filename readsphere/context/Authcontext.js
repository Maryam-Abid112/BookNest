"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [name,setname]=useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedName) {
      setname(storedName);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken,name,setname }}>
      {children}
    </AuthContext.Provider>
  );
}