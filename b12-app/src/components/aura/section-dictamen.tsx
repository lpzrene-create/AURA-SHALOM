import { ClassBadge } from "@/components/aura/badges";
import { Button } from "@/components/ui/button";
import { CLASSIFICATIONS, REGLAS_B12 } from "@/lib/b12/catalog";
import { textoRegla } from "@/lib/b12/evaluate";
import type { Evaluacion } from "@/lib/b12/types";
import { Play } from "lucide-react";

export function SectionDictamen({
  evaluacion,
  dirty,
  onRun,
}: {
  evaluacion: Evaluacion | null;
  dirty: boolean;
  onRun: () => void;
}) {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">Sección 4</p>
          <h2 className="font-display text-2xl text-navy text-balance">Dictamen epistemológico B12</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
            No es un índice de certeza. No usa el alcance comercial. No muestra porcentajes ni
            adjetivos absolutos.
          </p>
        </div>
        <Button type="button" variant="gold" onClick={onRun}>
          <Play className="size-4" />
          Ejecutar evaluación
        </Button>
      </header>

      {dirty && evaluacion ? (
        <p className="rounded-lg border border-b12-ambar/40 bg-b12-ambar-bg px-4 py-3 text-sm text-b12-ambar">
          El expediente cambió después de la última evaluación. Vuelva a ejecutar para actualizar el
          dictamen.
        </p>
      ) : null}

      {!evaluacion ? (
        <div className="rounded-xl border border-dashed border-line bg-card px-5 py-12 text-center text-sm text-muted">
          Aún no hay dictamen. Ejecute la evaluación sobre las evidencias registradas.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-navy/20 bg-navy p-6 text-paper">
            <p className="text-xs tracking-[0.18em] text-gold uppercase">Dictamen</p>
            <p className="mt-2 font-display text-3xl tracking-tight">{evaluacion.dictamen.replaceAll("_", " ")}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-paper/80">{evaluacion.fundamento}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-line bg-card p-5">
              <h3 className="text-xs tracking-[0.16em] text-muted uppercase">Índice de soporte</h3>
              <p className="mt-2 font-display text-2xl text-navy">NO DETERMINADO</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{evaluacion.indiceFundamento}</p>
            </article>
            <article className="rounded-xl border border-line bg-card p-5">
              <h3 className="text-xs tracking-[0.16em] text-muted uppercase">Cuello de botella</h3>
              <p className="mt-2 font-display text-xl text-navy">{evaluacion.cuelloBotella}</p>
              <p className="mt-2 text-sm text-muted">
                El alcance comercial de la sección 2 no participa en esta conclusión (R05, R06).
              </p>
            </article>
          </div>

          <article className="rounded-xl border border-line bg-card p-5">
            <h3 className="text-sm font-medium text-navy">Conteos por clasificación</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CLASSIFICATIONS.map((c) => (
                <div key={c} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
                  <ClassBadge value={c} />
                  <span className="font-mono text-sm tabular-nums text-ink">{evaluacion.conteos[c]}</span>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-line bg-card p-5">
              <h3 className="text-sm font-medium text-navy">Contradicciones ({evaluacion.contradicciones.length})</h3>
              {evaluacion.contradicciones.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Ninguna registrada.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {evaluacion.contradicciones.map((e) => (
                    <li key={e.id} className="rounded-md border border-b12-rojo/30 bg-b12-rojo-bg px-3 py-2 text-b12-rojo">
                      <span className="font-mono text-xs">{e.codigo}</span> · {e.campo}: {e.valor}
                    </li>
                  ))}
                </ul>
              )}
            </article>
            <article className="rounded-xl border border-line bg-card p-5">
              <h3 className="text-sm font-medium text-navy">Carencias ({evaluacion.carencias.length})</h3>
              {evaluacion.carencias.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Ninguna registrada.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {evaluacion.carencias.map((e) => (
                    <li key={e.id} className="rounded-md border border-b12-ambar/30 bg-b12-ambar-bg px-3 py-2 text-b12-ambar">
                      <span className="font-mono text-xs">{e.codigo}</span> · {e.campo}: {e.valor}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <article className="rounded-xl border border-line bg-card p-5">
            <h3 className="text-sm font-medium text-navy">Reglas aplicadas</h3>
            <ul className="mt-3 space-y-1 text-sm text-ink">
              {evaluacion.reglasAplicadas.map((c) => (
                <li key={c}>{textoRegla(c)}</li>
              ))}
            </ul>
          </article>
        </div>
      )}

      <article className="rounded-xl border border-line bg-card p-5">
        <h3 className="text-sm font-medium text-navy">Las 17 reglas metodológicas</h3>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
          {REGLAS_B12.map((r) => (
            <li key={r.codigo}>
              <span className="font-mono text-xs text-gold">{r.codigo}</span> {r.texto}
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}
