"use client";

import { createContext, useEffect, useState } from "react";
import { auth } from "@/utils/firebase/index";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { languages } from "@/utils/translations";
import { Messages } from "@/types/Messages";

export interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  googleLoginHandler: () => Promise<string | null>;
  logout: () => void;
  messages: Messages;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function AuthContextProvider({ children }: Props) {
  const [lang, setLang] = useState<string>("en-us");
  const [messages, setMessages] = useState<Messages>(
    languages.find((l) => l.lang === "en-us")!.messages
  );

  useEffect(() => {
    const chosenLang = localStorage.getItem("language");
    if (chosenLang) {
      setLang(chosenLang);
    } else {
      localStorage.setItem("language", "en-us");
    }
  }, []);

  useEffect(() => {
    const selectedLanguage = languages.find((l) => l.lang === lang);
    if (selectedLanguage) {
      setMessages(selectedLanguage.messages);
    }
  }, [lang]);

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

  const values: AuthContextType = {
    user,
    loading,
    googleLoginHandler,
    logout,
    messages,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
