import { createContext } from "react";

export const AuthProvider = createContext({
  accessToken: "",
  refreshToken: "",
  isLoggedIn: "",
  handleLogin: () => {},
  handleLogout: () => {},
});
