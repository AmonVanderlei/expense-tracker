"use client";

import { createContext } from "react";
import { auth } from "@/utils/firebase/index";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  googleLoginHandler: () => Promise<string | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function AuthContextProvider({ children }: Props) {
  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("profile");
  googleProvider.addScope("email");

  const googleLoginHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user.uid;
    } catch (error) {
      return null;
    }
  };

  const logout = () => {
    signOut(auth);
  };

  const values: AuthContextType = { user, loading, googleLoginHandler, logout };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
