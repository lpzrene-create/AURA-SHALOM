import {
  CLASSIFICATIONS,
  NIVELES,
  REGLAS_B12,
  VERIFICATION_STATES,
  type Classification,
  type VerificationState,
} from "./catalog";
import type { Alcance, DictamenCodigo, Evaluacion, Evidencia } from "./types";

const CRITICAS: Classification[] = [
  "CARENCIA",
  "CONTRADICCION",
  "DESCONOCIDO",
  "NO_DETERMINADO",
];

export function puntosAlcance(alcance: Alcance): number {
  return alcance.tamano * 10 + alcance.antiguedad * 5 + alcance.personal * 8 + alcance.complejidad * 12;
}

export function nivelRecomendado(puntos: number): (typeof NIVELES)[number] {
  return NIVELES.find((n) => puntos >= n.min && puntos <= n.max) ?? NIVELES[5];
}

function emptyCounts(): Record<Classification, number> {
  return Object.fromEntries(CLASSIFICATIONS.map((c) => [c, 0])) as Record<Classification, number>;
}

function emptyStates(): Record<VerificationState, number> {
  return Object.fromEntries(VERIFICATION_STATES.map((s) => [s, 0])) as Record<
    VerificationState,
    number
  >;
}

export function evaluarExpediente(evidencias: Evidencia[]): Evaluacion {
  const conteos = emptyCounts();
  const conteosEstado = emptyStates();
  for (const e of evidencias) {
    conteos[e.clasificacion] += 1;
    conteosEstado[e.verificacion] += 1;
  }

  const contradicciones = evidencias.filter(
    (e) => e.clasificacion === "CONTRADICCION" || e.verificacion === "CONTRADICHO",
  );
  const carencias = evidencias.filter((e) => e.clasificacion === "CARENCIA");

  let dictamen: DictamenCodigo = "NO_DETERMINADO";
  let fundamento: string;
  const reglas: string[] = ["R01", "R02", "R04", "R11"];

  if (evidencias.length === 0) {
    dictamen = "NO_DETERMINADO";
    fundamento =
      "No hay evidencias registradas. Sin base empírica no se emite conclusión. Campos vacíos se tratan como DESCONOCIDO (R01, R04).";
    reglas.push("R10");
  } else if (evidencias.some((e) => CRITICAS.includes(e.clasificacion))) {
    dictamen = "NO_DETERMINADO";
    fundamento =
      "Existe al menos una CARENCIA, CONTRADICCIÓN, DESCONOCIDO o NO_DETERMINADO. El dictamen permanece NO DETERMINADO. No se asume certeza donde hay duda (R02, R04, R09, R10).";
    reglas.push("R09", "R10");
  } else if (evidencias.every((e) => e.clasificacion === "HECHO")) {
    dictamen = "VERIFICADO";
    fundamento =
      "Todas las unidades de evidencia están clasificadas como HECHO. Prevalece la evidencia documentada (R03). Este dictamen no es una garantía de resultado comercial.";
    reglas.push("R03");
  } else if (evidencias.some((e) => e.clasificacion === "DECLARACION" || e.clasificacion === "HIPOTESIS")) {
    dictamen = "NO_DETERMINADO";
    fundamento =
      "Hay DECLARACIONES o HIPÓTESIS. Una declaración nunca se convierte en hecho (R07). Toda hipótesis permanece etiquetada (R08). El dictamen no se infla.";
    reglas.push("R07", "R08");
  } else if (
    evidencias.some((e) => e.clasificacion === "INTERPRETACION" || e.clasificacion === "OBSERVACION")
  ) {
    dictamen = "CONDICIONAL";
    fundamento =
      "Hay INTERPRETACIÓN u OBSERVACIÓN sin un conjunto exclusivo de HECHOS. El dictamen es CONDICIONAL: describe análisis u observación, no verificación plena.";
    reglas.push("R03");
  } else {
    dictamen = "NO_DETERMINADO";
    fundamento = "La composición del expediente no permite concluir. NO DETERMINADO es resultado honesto, no error (R04).";
  }

  let cuelloBotella = "INDETERMINADO POR CARENCIA DE INFORMACIÓN";
  if (evidencias.length < 8 || contradicciones.length > 0 || carencias.length > 2 || dictamen !== "VERIFICADO") {
    cuelloBotella = "INDETERMINADO POR CARENCIA DE INFORMACIÓN";
  }

  return {
    ejecutadaEn: new Date().toISOString(),
    conteos,
    conteosEstado,
    dictamen,
    fundamento,
    indiceSoporte: "NO_DETERMINADO",
    indiceFundamento:
      "El índice de soporte permanece NO DETERMINADO por decisión metodológica. No se inventa un porcentaje, ranking ni índice de certeza (R02, R04). Los conteos por clasificación son descriptivos del expediente, no una probabilidad de éxito.",
    cuelloBotella,
    contradicciones,
    carencias,
    reglasAplicadas: [...new Set(reglas)],
  };
}

export function textoRegla(codigo: string): string {
  const r = REGLAS_B12.find((x) => x.codigo === codigo);
  return r ? `${r.codigo}. ${r.texto}` : codigo;
}
