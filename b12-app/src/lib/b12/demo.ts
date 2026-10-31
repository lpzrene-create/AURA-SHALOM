import type { Alcance, Expediente, Evidencia } from "./types";

function ev(
  partial: Omit<Evidencia, "id" | "codigo" | "fecha" | "responsable" | "verificacion"> &
    Partial<Pick<Evidencia, "verificacion" | "responsable" | "fecha">>,
  i: number,
): Evidencia {
  return {
    id: `demo-${i}`,
    codigo: `B12-${String(i).padStart(3, "0")}`,
    fecha: "2026-09-12",
    responsable: "Analista de captura",
    verificacion: "PENDIENTE",
    ...partial,
  };
}

export const DEMO_EXPEDIENTE: Expediente = {
  codigo: "AURA-2026-0001",
  nombre: "Caso de validación — Servicios Shalom MX",
  negocio: "Logística y Servicios Shalom MX",
  responsable: "René López Barrera",
  giro: "Logística y servicios empresariales",
  ciudad: "Ciudad de México",
  estado: "BORRADOR",
  fecha: "2026-09-12",
  objeto:
    "Expediente incompleto de validación metodológica. Cliente declarado sin verificación; sin ventas, utilidad, capacidad ni conversión documentadas.",
};

export const DEMO_ALCANCE: Alcance = {
  tamano: 2,
  antiguedad: 2,
  personal: 2,
  complejidad: 3,
  nivelSeleccionado: null,
  modulos: 2,
};

export const DEMO_EVIDENCIAS: Evidencia[] = [
  ev(
    {
      campo: "cliente_actual",
      valor: "Cartera de clientes referida por el titular, sin padrón ni contratos adjuntos.",
      clasificacion: "DECLARACION",
      fuente: "Titular del negocio",
      observaciones: "Afirmación sin prueba. No se convierte en hecho (R07).",
    },
    1,
  ),
  ev(
    {
      campo: "ventas_periodo",
      valor: "DESCONOCIDO",
      clasificacion: "CARENCIA",
      fuente: "Expediente",
      observaciones: "Sin datos de ventas reales.",
    },
    2,
  ),
  ev(
    {
      campo: "utilidad_conocida",
      valor: "DESCONOCIDO",
      clasificacion: "CARENCIA",
      fuente: "Expediente",
      observaciones: "Sin datos de utilidad. No confundir ventas con utilidad (R14).",
    },
    3,
  ),
  ev(
    {
      campo: "capacidad_declarada",
      valor: "DESCONOCIDO",
      clasificacion: "CARENCIA",
      fuente: "Expediente",
      observaciones: "Sin capacidad de producción documentada (R12).",
    },
    4,
  ),
  ev(
    {
      campo: "conversion_pct",
      valor: "DESCONOCIDO",
      clasificacion: "CARENCIA",
      fuente: "Expediente",
      observaciones: "Sin conversión comercial documentada.",
    },
    5,
  ),
  ev(
    {
      campo: "numero_personas_declarado",
      valor: "8 personas",
      clasificacion: "DECLARACION",
      fuente: "Titular del negocio",
      observaciones: "Dato declarado. Contradice la observación de campo.",
    },
    6,
  ),
  ev(
    {
      campo: "numero_personas_observado",
      valor: "3 personas presentes en sitio el día de visita",
      clasificacion: "OBSERVACION",
      fuente: "Visita de campo 2026-09-12",
      verificacion: "EN_VERIFICACION",
      observaciones: "Hallazgo visual directo. No equivale a censo de plantilla.",
    },
    7,
  ),
  ev(
    {
      campo: "dotacion_inconsistente",
      valor: "Empleados declarados (8) ≠ empleados observados (3).",
      clasificacion: "CONTRADICCION",
      fuente: "Cruce declaración vs observación",
      verificacion: "CONTRADICHO",
      observaciones: "Contradicción abierta. Debe permanecer visible (R09).",
    },
    8,
  ),
];
