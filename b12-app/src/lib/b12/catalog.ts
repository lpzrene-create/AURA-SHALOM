export const APP_NAME = "AURA Empresarial — B12 Core v5.0";
export const COMPANY = "Servicios Shalom";
export const AUTHOR = "René López Barrera";
export const MOTTO = "INVESTIGO · DOCUMENTO · VERIFICO";
export const TAGLINE = "Buscando la Verdad para ser Libre";
export const STORAGE_KEY = "aura-empresarial-b12-v5";
export const HANDOFF_TITLE = "Documento de traspaso — AURA Empresarial B12 Core v5.0";
export const WEB = "www.serviciosshalom.com";
export const PHONE = "+52 55 3574 3838";

export const CLASSIFICATIONS = [
  "HECHO",
  "DECLARACION",
  "INTERPRETACION",
  "OBSERVACION",
  "HIPOTESIS",
  "CARENCIA",
  "CONTRADICCION",
  "DESCONOCIDO",
  "NO_DETERMINADO",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

export const CLASSIFICATION_META: Record<
  Classification,
  { label: string; hint: string; tone: "hecho" | "azul" | "gris" | "ambar" | "rojo" }
> = {
  HECHO: { label: "Hecho", hint: "Verificado y documentado.", tone: "hecho" },
  DECLARACION: { label: "Declaración", hint: "Afirmación sin prueba.", tone: "ambar" },
  INTERPRETACION: { label: "Interpretación", hint: "Análisis propio del analista.", tone: "azul" },
  OBSERVACION: { label: "Observación", hint: "Hallazgo visual directo.", tone: "gris" },
  HIPOTESIS: { label: "Hipótesis", hint: "Posible, no confirmado.", tone: "ambar" },
  CARENCIA: { label: "Carencia", hint: "Falta información crítica.", tone: "ambar" },
  CONTRADICCION: { label: "Contradicción", hint: "Datos opuestos entre fuentes.", tone: "rojo" },
  DESCONOCIDO: { label: "Desconocido", hint: "Sin acceso al dato.", tone: "ambar" },
  NO_DETERMINADO: { label: "No determinado", hint: "Insuficiente para concluir.", tone: "ambar" },
};

export const VERIFICATION_STATES = [
  "NO_DETERMINADO",
  "PENDIENTE",
  "EN_VERIFICACION",
  "VERIFICADO",
  "CONTRADICHO",
  "CERRADO",
] as const;

export type VerificationState = (typeof VERIFICATION_STATES)[number];

export const VERIFICATION_META: Record<VerificationState, { label: string }> = {
  NO_DETERMINADO: { label: "No determinado" },
  PENDIENTE: { label: "Pendiente" },
  EN_VERIFICACION: { label: "En verificación" },
  VERIFICADO: { label: "Verificado" },
  CONTRADICHO: { label: "Contradicho" },
  CERRADO: { label: "Cerrado" },
};

/** 17 reglas B12 Core v5.0 — texto congelado. No reformular. */
export const REGLAS_B12 = [
  { id: 1, codigo: "R01", texto: "No se inventa información." },
  { id: 2, codigo: "R02", texto: "No se asume certeza donde hay duda." },
  { id: 3, codigo: "R03", texto: "Prevalece la evidencia documentada." },
  { id: 4, codigo: "R04", texto: "NO DETERMINADO es resultado honesto, no error." },
  { id: 5, codigo: "R05", texto: "Alcance comercial es orientativo, nunca dictamen." },
  { id: 6, codigo: "R06", texto: "Separación absoluta: análisis comercial ≠ dictamen real." },
  { id: 7, codigo: "R07", texto: "Declaración nunca se convierte en hecho." },
  { id: 8, codigo: "R08", texto: "Hipótesis siempre etiquetada como tal." },
  { id: 9, codigo: "R09", texto: "Contradicción siempre visible." },
  { id: 10, codigo: "R10", texto: "Carencia siempre visible." },
  { id: 11, codigo: "R11", texto: "Conclusiones siempre con fuente." },
  { id: 12, codigo: "R12", texto: "No recomendar expansión sin datos de capacidad." },
  { id: 13, codigo: "R13", texto: "No recomendar escalamiento sin orden y rentabilidad." },
  { id: 14, codigo: "R14", texto: "No confundir ventas con utilidad." },
  { id: 15, codigo: "R15", texto: "No confundir alcance con ventas." },
  { id: 16, codigo: "R16", texto: "Costos cargados desde JSON, nunca hardcodeados." },
  { id: 17, codigo: "R17", texto: "Toda versión anterior debe permanecer consultable." },
] as const;

export const ALCANCE_SLIDERS = [
  { key: "tamano", label: "Tamaño", factor: 10, hint: "Escala declarada del negocio o encargo." },
  { key: "antiguedad", label: "Antigüedad", factor: 5, hint: "Madurez declarada de la operación." },
  { key: "personal", label: "Personal", factor: 8, hint: "Dotación declarada, no verificada." },
  { key: "complejidad", label: "Complejidad", factor: 12, hint: "Número de frentes y capas documentales." },
] as const;

export type AlcanceKey = (typeof ALCANCE_SLIDERS)[number]["key"];

export const NIVELES = [
  { nivel: 0, nombre: "Diagnóstico inicial", min: 0, max: 69, duracion: "1 semana" },
  { nivel: 1, nombre: "Básico", min: 70, max: 149, duracion: "2 semanas" },
  { nivel: 2, nombre: "Estándar", min: 150, max: 249, duracion: "4 semanas" },
  { nivel: 3, nombre: "Profesional", min: 250, max: 349, duracion: "6 semanas" },
  { nivel: 4, nombre: "Corporativo", min: 350, max: 449, duracion: "8 semanas" },
  { nivel: 5, nombre: "Proyecto personalizado", min: 450, max: Infinity, duracion: "a definir" },
] as const;
