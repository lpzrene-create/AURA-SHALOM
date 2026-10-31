import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { ALCANCE_SLIDERS, NIVELES, type AlcanceKey } from "@/lib/b12/catalog";
import { nivelRecomendado, puntosAlcance } from "@/lib/b12/evaluate";
import { PRECIOS, calcularCostoOrientativo, formatMxn } from "@/lib/b12/precios";
import type { Alcance } from "@/lib/b12/types";

export function SectionAlcance({
  value,
  onChange,
  onSave,
}: {
  value: Alcance;
  onChange: (patch: Partial<Alcance>) => void;
  onSave: () => void;
}) {
  const puntos = puntosAlcance(value);
  const rec = nivelRecomendado(puntos);
  const elegido = value.nivelSeleccionado ?? rec.nivel;
  const costo = calcularCostoOrientativo(elegido, value.modulos);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">Sección 2</p>
        <h2 className="font-display text-2xl text-navy text-balance">Alcance comercial orientativo</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          R05 / R06. Este bloque no alimenta el dictamen epistemológico. El nivel recomendado es
          un cálculo de sliders; el nivel seleccionado es una declaración, no un hecho. R16: costos
          desde JSON.
        </p>
      </header>

      <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-ink">
        Análisis comercial ≠ dictamen real. Ningún slider, punto ni tarifa se copia a la sección 4.
      </div>

      <div className="rounded-xl border border-line bg-card p-5 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {ALCANCE_SLIDERS.map((s) => (
            <Field key={s.key} label={`${s.label} (${value[s.key as AlcanceKey]})`} hint={s.hint}>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={value[s.key as AlcanceKey]}
                onChange={(e) => onChange({ [s.key]: Number(e.target.value) } as Partial<Alcance>)}
                className="w-full accent-navy"
              />
            </Field>
          ))}
        </div>

        <dl className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Puntos</dt>
            <dd className="font-display text-2xl text-navy tabular-nums">{puntos}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Nivel recomendado</dt>
            <dd className="text-sm font-medium text-ink">
              {rec.nivel} · {rec.nombre}
            </dd>
            <dd className="text-xs text-muted">{rec.duracion}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-muted uppercase">Nivel seleccionado</dt>
            <dd>
              <select
                value={elegido}
                onChange={(e) => onChange({ nivelSeleccionado: Number(e.target.value) })}
                className="mt-1 min-h-11 w-full rounded-md border border-line bg-card px-3 text-sm"
              >
                {NIVELES.map((n) => (
                  <option key={n.nivel} value={n.nivel}>
                    {n.nivel} — {n.nombre}
                  </option>
                ))}
              </select>
            </dd>
          </div>
        </dl>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Módulos declarados" hint="Entero. No es un hecho de capacidad.">
            <TextInput
              type="number"
              min={0}
              value={value.modulos}
              onChange={(e) => onChange({ modulos: Number(e.target.value) || 0 })}
            />
          </Field>
          <div className="rounded-lg border border-line bg-paper p-4">
            <p className="text-xs tracking-wide text-muted uppercase">Costo orientativo</p>
            {costo.tipo === "CALCULADO" ? (
              <p className="mt-1 font-display text-2xl text-navy tabular-nums">{formatMxn(costo.total)}</p>
            ) : (
              <p className="mt-1 text-sm text-ink">{costo.motivo}</p>
            )}
            {costo.tipo === "CALCULADO" ? (
              <p className="mt-1 text-xs text-muted">
                Subtotal {formatMxn(costo.subtotal)} + IVA {formatMxn(costo.iva)} · {PRECIOS.estado}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">{PRECIOS.aviso}</p>
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={onSave}>
            Guardar decisión de alcance
          </Button>
        </div>
      </div>
    </section>
  );
}
