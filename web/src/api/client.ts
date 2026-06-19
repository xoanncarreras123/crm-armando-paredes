// Cliente HTTP mínimo sobre fetch. Inyecta el JWT y maneja errores.
const BASE = import.meta.env.VITE_API_URL ?? "/api";

export const USE_MOCKS =
  (import.meta.env.VITE_USE_MOCKS ?? "true") !== "false"; // dev: mocks por defecto

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function token(): string | null {
  return localStorage.getItem("crm_token");
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// Simula latencia de red para que los skeletons se vean en dev con mocks.
export const mock = <T>(data: T, ms = 600): Promise<T> =>
  new Promise((r) => setTimeout(() => r(data), ms));
