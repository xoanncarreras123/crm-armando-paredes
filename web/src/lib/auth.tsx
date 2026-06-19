import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api, USE_MOCKS } from "@/api/client";

// Credenciales de demo para modo mocks (sin backend).
const DEMO_USERS: Record<string, AsesorSession> = {
  "camila.rebaza@armandoparedes.pe": { sub: "demo-1", email: "camila.rebaza@armandoparedes.pe", nombre: "Camila Rebaza Higa" },
  "rodrigo.velarde@armandoparedes.pe": { sub: "demo-2", email: "rodrigo.velarde@armandoparedes.pe", nombre: "Rodrigo Velarde Mendoza" },
};

// ============================================================================
// Auth — JWT session para el CRM Armando Paredes
// ============================================================================

export interface AsesorSession {
  sub: string;
  email: string;
  nombre: string;
}

interface AuthCtx {
  session: AsesorSession | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "crm_token";

function readSession(): AsesorSession | null {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;
    if (token === "demo-token") {
      return DEMO_USERS["camila.rebaza@armandoparedes.pe"] ?? null;
    }
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload)) as AsesorSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AsesorSession | null>(readSession);

  const login = useCallback(async (email: string, password: string) => {
    if (USE_MOCKS) {
      // Modo demo: acepta cualquier contraseña para los usuarios de demo.
      const demo = DEMO_USERS[email.toLowerCase()];
      if (!demo || password.length < 4) throw new Error("Credenciales inválidas");
      localStorage.setItem(STORAGE_KEY, "demo-token");
      setSession(demo);
      return;
    }
    const { token, asesor } = await api<{ token: string; asesor: AsesorSession }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
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
