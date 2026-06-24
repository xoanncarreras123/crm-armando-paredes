export interface AsesorSession {
  sub: string;
  email: string;
  nombre: string;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<{ token: string; asesor: AsesorSession }>;
}
