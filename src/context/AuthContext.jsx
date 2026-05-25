import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zaytona_user")) || null;
    } catch (e) {
      return null;
    }
  });

  // 🔥 مهم: مزامنة التغيرات بين التبويبات / الصفحات
  useEffect(() => {
    const syncAuth = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("zaytona_user"));
        setUser(storedUser || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const isAuthenticated = !!user;

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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        saveUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}