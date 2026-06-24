import type { IAuthRepository, AsesorSession } from "@/domain/repositories/IAuthRepository";

const DEMO_USERS: Record<string, AsesorSession> = {
  "camila.rebaza@armandoparedes.pe":  { sub:"demo-1", email:"camila.rebaza@armandoparedes.pe",  nombre:"Camila Rebaza Higa"      },
  "rodrigo.velarde@armandoparedes.pe":{ sub:"demo-2", email:"rodrigo.velarde@armandoparedes.pe", nombre:"Rodrigo Velarde Mendoza" },
};

export class MockAuthRepository implements IAuthRepository {
  async login(email: string, password: string) {
    await new Promise<void>((r) => setTimeout(r, 400));
    const asesor = DEMO_USERS[email.toLowerCase()];
    if (!asesor || password.length < 4) throw new Error("Credenciales inválidas");
    return { token: "demo-token", asesor };
  }
}
