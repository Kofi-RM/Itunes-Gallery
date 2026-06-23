import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook that returns auth helpers and token state from AuthContext.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};