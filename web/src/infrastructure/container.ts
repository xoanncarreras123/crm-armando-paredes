// Contenedor de dependencias — inyecta mock o implementación real según el entorno.
// Para conectar el backend real: cambiar cada "Mock*" por su "Api*" equivalente.

import { MockProspectoRepository }  from "./mocks/MockProspectoRepository";
import { MockOportunidadRepository } from "./mocks/MockOportunidadRepository";
import { MockUnidadRepository, MockProyectoRepository } from "./mocks/MockInventarioRepository";
import { MockAuthRepository }        from "./mocks/MockAuthRepository";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const container = {
  prospectos:   USE_MOCKS ? new MockProspectoRepository()  : new MockProspectoRepository(),
  oportunidades:USE_MOCKS ? new MockOportunidadRepository(): new MockOportunidadRepository(),
  unidades:     USE_MOCKS ? new MockUnidadRepository()     : new MockUnidadRepository(),
  proyectos:    USE_MOCKS ? new MockProyectoRepository()   : new MockProyectoRepository(),
  auth:         USE_MOCKS ? new MockAuthRepository()       : new MockAuthRepository(),
} as const;
