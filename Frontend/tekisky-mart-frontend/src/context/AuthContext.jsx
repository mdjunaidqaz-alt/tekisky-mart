import { createContext, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [user, setUser] = useState(userInfo);

  const login = async (data) => {
    const res = await authService.login(data);
    localStorage.setItem("userInfo", JSON.stringify(res));
    localStorage.setItem("token", res.token);
    setUser(res);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
