import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";
import { LoginResponse } from "../types/types";

interface AuthContextData {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  async function login(username: string, password: string): Promise<void> {
    const response = await api.post<LoginResponse>("/login", {
      username,
      password,
    });

    const { token: newToken } = response.data;

    setToken(newToken);
    localStorage.setItem("token", newToken);
  }

  function logout(): void {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
