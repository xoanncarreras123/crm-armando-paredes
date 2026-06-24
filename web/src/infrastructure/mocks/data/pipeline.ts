import type { Oportunidad, DashboardMetrics } from "@/domain/entities/Oportunidad";

const dias = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const MOCK_METRICS: DashboardMetrics = {
  pipelineTotal: 4_820_000,
  pipelineDeltaPct: 0.12,
  tasaCierre: 0.24,
  tasaCierreDeltaPct: 0.03,
  tiempoPromedioDias: 38,
  tiempoPromedioDeltaDias: -4,
  enRiesgo: 3,
};

export const MOCK_PIPELINE: Oportunidad[] = [
  { id:"o1", etapa:"RESERVA",     score:87, valorEstimado:685_000, ultimaActividad:dias(1),  diasEnEtapa:4,  siguienteAccion:"Confirmar firma de separación",       prospecto:{id:"p1",nombre:"Gonzalo Ferreyros",  telefono:"+51991234567",tipoCompra:"VIVIENDA"}, proyecto:{id:"pr1",nombre:"Torre Basadre",         distrito:"San Isidro"}, asesor:{id:"a1",nombre:"Camila Rebaza"}  },
  { id:"o2", etapa:"NEGOCIACION", score:64, valorEstimado:540_000, ultimaActividad:dias(30), diasEnEtapa:30, siguienteAccion:"Reactivar — 30 días sin contacto",    prospecto:{id:"p2",nombre:"Patricia Zegarra",   telefono:"+51956778990",tipoCompra:"INVERSION"},proyecto:{id:"pr2",nombre:"Malecón 28",            distrito:"Barranco"},   asesor:{id:"a1",nombre:"Camila Rebaza"}  },
  { id:"o3", etapa:"CALIFICADO",  score:41, valorEstimado:268_000, ultimaActividad:dias(2),  diasEnEtapa:6,  siguienteAccion:"Enviar cotización del 301",            prospecto:{id:"p3",nombre:"Andrés Cáceres",     telefono:"+51944556677",tipoCompra:"VIVIENDA"}, proyecto:{id:"pr1",nombre:"Torre Basadre",         distrito:"San Isidro"}, asesor:{id:"a2",nombre:"Rodrigo Velarde"} },
  { id:"o4", etapa:"PROPUESTA",   score:72, valorEstimado:420_000, ultimaActividad:dias(3),  diasEnEtapa:9,  siguienteAccion:"Agendar 2da visita con la pareja",     prospecto:{id:"p4",nombre:"Lucía Mendiola",     telefono:"+51987001122",tipoCompra:"VIVIENDA"}, proyecto:{id:"pr1",nombre:"Torre Basadre",         distrito:"San Isidro"}, asesor:{id:"a1",nombre:"Camila Rebaza"}  },
  { id:"o5", etapa:"NUEVO",       score:18, valorEstimado:312_000, ultimaActividad:dias(0),  diasEnEtapa:1,  siguienteAccion:"Primer contacto por WhatsApp",         prospecto:{id:"p5",nombre:"Diego Salcedo",      telefono:"+51999887766",tipoCompra:"INVERSION"},proyecto:{id:"pr3",nombre:"Pardo Business Center", distrito:"Miraflores"}, asesor:{id:"a2",nombre:"Rodrigo Velarde"} },
  { id:"o6", etapa:"NUEVO",       score:33, valorEstimado:295_000, ultimaActividad:dias(1),  diasEnEtapa:2,  siguienteAccion:"Calificar presupuesto y plazo",        prospecto:{id:"p6",nombre:"Valeria Contreras",  telefono:"+51955443322",tipoCompra:"VIVIENDA"}, proyecto:{id:"pr2",nombre:"Malecón 28",            distrito:"Barranco"},   asesor:{id:"a1",nombre:"Camila Rebaza"}  },
  { id:"o7", etapa:"PROPUESTA",   score:58, valorEstimado:798_000, ultimaActividad:dias(5),  diasEnEtapa:12, siguienteAccion:"Seguimiento a propuesta del PH",       prospecto:{id:"p7",nombre:"Martín Higa",        telefono:"+51961224488",tipoCompra:"VIVIENDA"}, proyecto:{id:"pr2",nombre:"Malecón 28",            distrito:"Barranco"},   asesor:{id:"a1",nombre:"Camila Rebaza"}  },
];
