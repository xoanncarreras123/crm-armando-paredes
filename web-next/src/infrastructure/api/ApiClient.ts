// Cliente HTTP para hablar con el backend Express del CRM.
// Lee la base de la API de NEXT_PUBLIC_API_URL y adjunta el JWT guardado
// por AuthProvider en localStorage. Normaliza el formato de error del backend
// ({ error: { code, message } }) a un Error con mensaje legible.

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "crm_token";

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(TOKEN_KEY);
  return token && token !== "demo-token" ? { Authorization: `Bearer ${token}` } : {};
}

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let err: ApiErrorShape = { code: "HTTP_ERROR", message: `${res.status} ${res.statusText}` };
    try {
      const parsed = (await res.json()) as { error?: ApiErrorShape };
      if (parsed?.error) err = parsed.error;
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new ApiError(res.status, err.code, err.message, err.details);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
