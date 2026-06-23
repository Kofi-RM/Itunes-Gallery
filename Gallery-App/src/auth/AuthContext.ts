

import { createContext } from "react";

type User = {
  _id: string;
  username: string;
  profileImageUrl: string;
};


type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loggedIn: boolean;
 user: User | null;
 setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Auth context provides token state and login/logout helpers to the app.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);