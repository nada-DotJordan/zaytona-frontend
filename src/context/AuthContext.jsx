import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("zaytona_user")) || null
  );

  function saveUser(userData) {
    setUser(userData);
    localStorage.setItem("zaytona_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("zaytona_user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}