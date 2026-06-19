"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { container } from "@/infrastructure/container";
import type { AsesorSession } from "@/domain/repositories/IAuthRepository";

interface AuthCtx {
  session: AsesorSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "crm_token";

function readSession(): AsesorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;
    if (token === "demo-token") {
      return { sub:"demo-1", email:"camila.rebaza@armandoparedes.pe", nombre:"Camila Rebaza Higa" };
    }
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload)) as AsesorSession;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AsesorSession | null>(readSession);

  const login = useCallback(async (email: string, password: string) => {
    const { token, asesor } = await container.auth.login(email, password);
    localStorage.setItem(STORAGE_KEY, token);
    setSession(asesor);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return <Ctx.Provider value={{ session, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
}
