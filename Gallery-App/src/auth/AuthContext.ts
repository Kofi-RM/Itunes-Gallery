

import { createContext } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;

};

// Auth context provides token state and login/logout helpers to the app.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);