// Contenedor de dependencias — inyecta mock o implementación real según el entorno.
// Toggle: NEXT_PUBLIC_USE_MOCKS=false activa las implementaciones reales (Api*).

import { MockProspectoRepository }  from "./mocks/MockProspectoRepository";
import { MockOportunidadRepository } from "./mocks/MockOportunidadRepository";
import { MockUnidadRepository, MockProyectoRepository } from "./mocks/MockInventarioRepository";
import { MockAuthRepository }        from "./mocks/MockAuthRepository";
import { ApiAuthRepository }         from "./api/ApiAuthRepository";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

// NOTA: la autenticación ya tiene implementación real (POST /api/auth/login).
// Los repositorios de datos siguen en mock porque su integración real está
// pendiente de: (a) mappers respuesta-backend → entidad de dominio, y
// (b) endpoints aún inexistentes en el backend (lista de proyectos, lista de
// oportunidades y métricas de dashboard). Hasta entonces usan mock incluso con
// USE_MOCKS=false, de forma explícita (antes era un copy-paste que hacía el
// toggle inútil). Ver TODO(backend) en cada caso.
export const container = {
  auth:          USE_MOCKS ? new MockAuthRepository()      : new ApiAuthRepository(),
  prospectos:    new MockProspectoRepository(),   // TODO(backend): ApiProspectoRepository + mapper de GET /api/prospectos
  oportunidades: new MockOportunidadRepository(),  // TODO(backend): falta endpoint GET /api/oportunidades + métricas
  unidades:      new MockUnidadRepository(),       // TODO(backend): ApiUnidadRepository sobre GET /api/proyectos/:id/unidades
  proyectos:     new MockProyectoRepository(),     // TODO(backend): falta endpoint GET /api/proyectos
} as const;
