import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));

  function saveAuth(newToken, newUserId) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user_id", newUserId);
    setToken(newToken);
    setUserId(newUserId);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setToken(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ token, userId, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
