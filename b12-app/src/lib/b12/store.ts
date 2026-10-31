import { create } from "zustand";
import { STORAGE_KEY } from "./catalog";
import { DEMO_ALCANCE, DEMO_EVIDENCIAS, DEMO_EXPEDIENTE } from "./demo";
import { evaluarExpediente } from "./evaluate";
import type {
  Alcance,
  AuraPayload,
  Evaluacion,
  Evidencia,
  Expediente,
  VersionSnapshot,
} from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextProjectCode(existing?: string[]): string {
  const year = new Date().getFullYear();
  const used = new Set((existing ?? []).map((c) => c.split("-").pop()));
  for (let n = 1; n < 10000; n++) {
    const token = String(n).padStart(4, "0");
    if (!used.has(token)) return `AURA-${year}-${token}`;
  }
  return `AURA-${year}-9999`;
}

function nextEvidenceCode(items: Evidencia[]): string {
  const max = items.reduce((acc, e) => {
    const n = Number.parseInt(e.codigo.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `B12-${String(max + 1).padStart(3, "0")}`;
}

const INITIAL_EXPEDIENTE: Expediente = {
  codigo: "",
  nombre: "",
  negocio: "",
  responsable: "",
  giro: "",
  ciudad: "",
  estado: "BORRADOR",
  fecha: "",
  objeto: "",
};

const INITIAL_ALCANCE: Alcance = {
  tamano: 1,
  antiguedad: 1,
  personal: 1,
  complejidad: 1,
  nivelSeleccionado: null,
  modulos: 1,
};

export function emptyExpediente(): Expediente {
  return {
    ...INITIAL_EXPEDIENTE,
    codigo: nextProjectCode(),
    fecha: today(),
  };
}

export function emptyAlcance(): Alcance {
  return { ...INITIAL_ALCANCE };
}

function emptyEvidencia(items: Evidencia[]): Evidencia {
  return {
    id: uid(),
    codigo: nextEvidenceCode(items),
    campo: "",
    valor: "",
    clasificacion: "NO_DETERMINADO",
    verificacion: "NO_DETERMINADO",
    fuente: "",
    responsable: "",
    fecha: today(),
    observaciones: "",
  };
}

type AuraState = AuraPayload & {
  hydrated: boolean;
  hydrate: () => void;
  persist: () => void;
  setExpediente: (patch: Partial<Expediente>) => void;
  setAlcance: (patch: Partial<Alcance>) => void;
  addEvidencia: () => string;
  updateEvidencia: (id: string, patch: Partial<Evidencia>) => void;
  removeEvidencia: (id: string) => void;
  evaluar: () => Evaluacion;
  loadDemo: () => void;
  reset: () => void;
  snapshot: (motivo: string) => void;
  importPayload: (raw: unknown) => string | null;
};

function dataOf(s: AuraState): AuraPayload {
  return {
    v: 5,
    expediente: s.expediente,
    evidencias: s.evidencias,
    alcance: s.alcance,
    evaluacion: s.evaluacion,
    versiones: s.versiones,
    updatedAt: s.updatedAt,
    dirty: s.dirty,
  };
}

function persistNow(s: AuraState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataOf(s)));
}

export const useAuraStore = create<AuraState>((set, get) => ({
  v: 5,
  expediente: INITIAL_EXPEDIENTE,
  evidencias: [],
  alcance: INITIAL_ALCANCE,
  evaluacion: null,
  versiones: [],
  updatedAt: "",
  dirty: false,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const expediente = emptyExpediente();
        set({ expediente, hydrated: true, updatedAt: new Date().toISOString() });
        persistNow(get());
        return;
      }
      const parsed = JSON.parse(raw) as AuraPayload;
      if (parsed?.v !== 5) {
        set({ hydrated: true });
        return;
      }
      set({
        expediente: { ...emptyExpediente(), ...parsed.expediente },
        evidencias: parsed.evidencias ?? [],
        alcance: { ...emptyAlcance(), ...parsed.alcance },
        evaluacion: parsed.evaluacion ?? null,
        versiones: parsed.versiones ?? [],
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        dirty: parsed.dirty ?? false,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  persist: () => persistNow(get()),

  setExpediente: (patch) => {
    set((s) => {
      const next = {
        ...s,
        expediente: { ...s.expediente, ...patch },
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  setAlcance: (patch) => {
    set((s) => {
      const next = {
        ...s,
        alcance: { ...s.alcance, ...patch },
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  addEvidencia: () => {
    const item = emptyEvidencia(get().evidencias);
    set((s) => {
      const next = {
        ...s,
        evidencias: [item, ...s.evidencias],
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
    return item.id;
  },

  updateEvidencia: (id, patch) => {
    set((s) => {
      const next = {
        ...s,
        evidencias: s.evidencias.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  removeEvidencia: (id) => {
    set((s) => {
      const next = {
        ...s,
        evidencias: s.evidencias.filter((e) => e.id !== id),
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  evaluar: () => {
    const evaluacion = evaluarExpediente(get().evidencias);
    set((s) => {
      const snap: VersionSnapshot = {
        numero: s.versiones.length + 1,
        fecha: new Date().toISOString(),
        motivo: "Evaluación B12 ejecutada",
      };
      const next = {
        ...s,
        evaluacion,
        dirty: false,
        versiones: [...s.versiones, snap],
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
    return evaluacion;
  },

  loadDemo: () => {
    set((s) => {
      const next = {
        ...s,
        expediente: { ...DEMO_EXPEDIENTE },
        evidencias: DEMO_EVIDENCIAS.map((e) => ({ ...e, id: uid() })),
        alcance: { ...DEMO_ALCANCE },
        evaluacion: null,
        dirty: true,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  reset: () => {
    set((s) => {
      const next = {
        ...s,
        expediente: emptyExpediente(),
        evidencias: [],
        alcance: emptyAlcance(),
        evaluacion: null,
        dirty: false,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
  },

  snapshot: (motivo) => {
    set((s) => {
      const snap: VersionSnapshot = {
        numero: s.versiones.length + 1,
        fecha: new Date().toISOString(),
        motivo,
      };
      const next = { ...s, versiones: [...s.versiones, snap], updatedAt: new Date().toISOString() };
      persistNow(next as AuraState);
      return next;
    });
  },

  importPayload: (raw) => {
    if (!raw || typeof raw !== "object") return "El archivo no es un objeto JSON.";
    const p = raw as Partial<AuraPayload>;
    if (p.v !== 5) return "Versión de archivo no reconocida.";
    if (!p.expediente) return "Falta el expediente.";
    set((s) => {
      const next = {
        ...s,
        expediente: { ...emptyExpediente(), ...p.expediente },
        evidencias: p.evidencias ?? [],
        alcance: { ...emptyAlcance(), ...p.alcance },
        evaluacion: p.evaluacion ?? null,
        versiones: p.versiones ?? s.versiones,
        dirty: false,
        updatedAt: new Date().toISOString(),
      };
      persistNow(next as AuraState);
      return next;
    });
    return null;
  },
}));
