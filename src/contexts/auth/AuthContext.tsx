"use client";

import { UserProfile } from "@/types/index.t";
import { User } from "@supabase/supabase-js";
import { createContext, Dispatch, ReactNode, useState } from "react";

export const AuthContext = createContext<{
  profile: UserProfile | null;
  userAuth: User | null;
  setProfile: Dispatch<UserProfile | null>;
  setUserAuth: Dispatch<User | null>;
}>({
  profile: null,
  userAuth: null,
  setProfile: () => {},
  setUserAuth: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialProfile?: UserProfile | null;
}

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: AuthProviderProps) {
  const [userAuth, setUserAuth] = useState<User | null>(initialUser || null);
  const [profile, setProfile] = useState<UserProfile | null>(
    initialProfile || null
  );

  return (
    <AuthContext.Provider
      value={{ profile, userAuth, setUserAuth, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
