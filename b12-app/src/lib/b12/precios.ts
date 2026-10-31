import preciosJson from "./precios.json";

export type PrecioNivel = {
  nombre: string;
  base: number | null;
  modulo: number | null;
};

export type PreciosConfig = {
  aviso: string;
  moneda: string;
  iva: number;
  estado: string;
  niveles: Record<string, PrecioNivel>;
};

export const PRECIOS = preciosJson as PreciosConfig;

export type CostoOrientativo =
  | { tipo: "CALCULADO"; subtotal: number; iva: number; total: number; moneda: string }
  | { tipo: "NO_CALCULADO"; motivo: string };

export function calcularCostoOrientativo(
  nivel: number,
  modulos: number,
  config: PreciosConfig = PRECIOS,
): CostoOrientativo {
  const row = config.niveles[String(nivel)];
  if (!row) {
    return { tipo: "NO_CALCULADO", motivo: "Nivel ausente en precios.json." };
  }
  if (row.base === null || row.modulo === null) {
    return {
      tipo: "NO_CALCULADO",
      motivo: nivel === 5 ? "Nivel 5 (personalizado): el precio no se calcula. Requiere cotización expresa." : "Precio pendiente de aprobación. Requiere cotización expresa.",
    };
  }
  const n = Math.max(0, Math.floor(modulos));
  const subtotal = row.base + row.modulo * n;
  const iva = subtotal * config.iva;
  return { tipo: "CALCULADO", subtotal, iva, total: subtotal + iva, moneda: config.moneda };
}

export function formatMxn(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}
