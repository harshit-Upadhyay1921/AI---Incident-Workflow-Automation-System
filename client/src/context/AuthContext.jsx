import { createContext, useContext, useState, useEffect } from "react";

// 1. Create context
const AuthContext = createContext();

// 2. Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // stores user info
  const [role, setRole] = useState(null);               // admin/support/employee
  const [loading, setLoading] = useState(true);

  // Load user from localStorage (for page refresh)
  useEffect(() => {
    const savedUser = localStorage.getItem("incidentiq_user");
    const savedRole = localStorage.getItem("incidentiq_role");

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedRole) setRole(savedRole);

    setLoading(false);
  }, []);

  // LOGIN FUNCTION
  const login = (userData) => {
    setCurrentUser(userData);
    setRole(userData.role);

    localStorage.setItem("incidentiq_user", JSON.stringify(userData));
    localStorage.setItem("incidentiq_role", userData.role);
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setCurrentUser(null);
    setRole(null);

    localStorage.removeItem("incidentiq_user");
    localStorage.removeItem("incidentiq_role");
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. useAuth Hook (to access auth everywhere)
export const useAuth = () => useContext(AuthContext);
