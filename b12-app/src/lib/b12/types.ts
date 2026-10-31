import type { AlcanceKey, Classification, VerificationState } from "./catalog";

export type ExpedienteEstado = "BORRADOR" | "ACTIVO" | "ARCHIVADO";

export type Expediente = {
  codigo: string;
  nombre: string;
  negocio: string;
  responsable: string;
  giro: string;
  ciudad: string;
  estado: ExpedienteEstado;
  fecha: string;
  objeto: string;
};

export type Evidencia = {
  id: string;
  codigo: string;
  campo: string;
  valor: string;
  clasificacion: Classification;
  verificacion: VerificationState;
  fuente: string;
  responsable: string;
  fecha: string;
  observaciones: string;
};

export type Alcance = Record<AlcanceKey, number> & {
  nivelSeleccionado: number | null;
  modulos: number;
};

export type DictamenCodigo = "NO_DETERMINADO" | "VERIFICADO" | "CONDICIONAL";

export type Evaluacion = {
  ejecutadaEn: string;
  conteos: Record<Classification, number>;
  conteosEstado: Record<VerificationState, number>;
  dictamen: DictamenCodigo;
  fundamento: string;
  indiceSoporte: "NO_DETERMINADO";
  indiceFundamento: string;
  cuelloBotella: string;
  contradicciones: Evidencia[];
  carencias: Evidencia[];
  reglasAplicadas: string[];
};

export type VersionSnapshot = {
  numero: number;
  fecha: string;
  motivo: string;
};

export type AuraPayload = {
  v: 5;
  expediente: Expediente;
  evidencias: Evidencia[];
  alcance: Alcance;
  evaluacion: Evaluacion | null;
  versiones: VersionSnapshot[];
  updatedAt: string;
  dirty: boolean;
};
