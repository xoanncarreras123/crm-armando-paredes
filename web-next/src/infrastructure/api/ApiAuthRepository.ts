import type { IAuthRepository, AsesorSession } from "@/domain/repositories/IAuthRepository";
import { apiClient } from "./ApiClient";

// Login real contra el backend Express (POST /api/auth/login).
// La respuesta del backend ({ token, asesor: { sub, email, nombre } }) mapea
// 1:1 con el contrato del dominio, así que no necesita transformación.
export class ApiAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<{ token: string; asesor: AsesorSession }> {
    return apiClient.post<{ token: string; asesor: AsesorSession }>("/auth/login", {
      email,
      password,
    });
  }
}
