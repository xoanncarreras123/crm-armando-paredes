import type { EstadoUnidad } from "@/domain/entities/Unidad";
import type { Unidad } from "@/domain/entities/Unidad";
import type { Proyecto } from "@/domain/entities/Proyecto";

export const MOCK_PROYECTOS: Proyecto[] = [
  { id:"pr1", nombre:"Torre Basadre",         distrito:"San Isidro",  estado:"EN_VENTA",        avanceObra:45,  fechaEntrega:"2027-03-31", totalUnidades:48, disponibles:24, reservadas:12, vendidas:12, ticketDesde:268_000 },
  { id:"pr2", nombre:"Malecón 28",             distrito:"Barranco",    estado:"EN_CONSTRUCCION", avanceObra:20,  fechaEntrega:"2027-12-15", totalUnidades:24, disponibles:12, reservadas:6,  vendidas:6,  ticketDesde:540_000 },
  { id:"pr3", nombre:"Pardo Business Center",  distrito:"Miraflores",  estado:"ENTREGADO",       avanceObra:100, fechaEntrega:"2025-09-01", totalUnidades:12, disponibles:6,  reservadas:3,  vendidas:3,  ticketDesde:312_000 },
];

const VISTAS = ["PARQUE","CIUDAD","INTERIOR","MAR"] as const;
const TIPOLOGIA: Record<number,string> = { 1:"Flat 1 dorm", 2:"Flat 2 dorm", 3:"Flat 3 dorm" };
const CICLO: EstadoUnidad[] = [
  "DISPONIBLE","DISPONIBLE","VENDIDA","DISPONIBLE","NEGOCIACION",
  "DISPONIBLE","VENDIDA","BLOQUEADO","DISPONIBLE","ENTREGA",
  "DISPONIBLE","VENDIDA",
];
const PROPIETARIOS = ["Inmobiliaria GP7 SAC","Fondo Larcomar","C. Ferreyros","J. Manchego","R. Castillo","—"];

function genEdificio(prefix: string, pisoIni: number, pisos: number, perFloor: number, basePrecio: number): Unidad[] {
  const out: Unidad[] = [];
  let idx = 0;
  for (let p = 0; p < pisos; p++) {
    const piso = pisoIni + p;
    for (let j = 0; j < perFloor; j++) {
      const suf  = String(j + 1).padStart(2, "0");
      const dorm = j === 0 ? 3 : j === perFloor - 1 ? 1 : 2;
      const area = dorm === 3 ? 138 + (p % 3) * 4 : dorm === 2 ? 92 + (p % 3) * 3 : 58 + (p % 2) * 4;
      const estado = CICLO[idx % CICLO.length];
      const precio = Math.round((basePrecio + (dorm - 1) * 110_000 + piso * 5_200) / 1000) * 1000;
      out.push({
        id: `${prefix}-${piso}${suf}`, piso, numero:`${piso}${suf}`, area,
        dormitorios:dorm, banos:dorm===1?1:dorm===2?2:3, precio, estado,
        vista:VISTAS[(j+p)%VISTAS.length], tieneTerraza:j===0||p===pisos-1,
        estacionamientos:dorm>=2?2:1,
        interesados:estado==="DISPONIBLE"?(idx*3)%5:0,
        tipologia:p===pisos-1?"Penthouse":TIPOLOGIA[dorm],
        tienePlano:idx%3===0,
        propietario:estado==="VENDIDA"?PROPIETARIOS[idx%PROPIETARIOS.length]:undefined,
      });
      idx++;
    }
  }
  return out;
}

export const MOCK_UNIDADES: Record<string, Unidad[]> = {
  pr1: genEdificio("pr1", 3,  12, 4, 200_000),
  pr2: genEdificio("pr2", 2,  8,  3, 320_000),
  pr3: genEdificio("pr3", 5,  6,  2, 260_000),
};
