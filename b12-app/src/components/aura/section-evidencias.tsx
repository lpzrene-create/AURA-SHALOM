import { ClassBadge, StateBadge } from "@/components/aura/badges";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import {
  CLASSIFICATION_META,
  CLASSIFICATIONS,
  VERIFICATION_META,
  VERIFICATION_STATES,
  type Classification,
  type VerificationState,
} from "@/lib/b12/catalog";
import type { Evidencia } from "@/lib/b12/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function SectionEvidencias({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: Evidencia[];
  onAdd: () => string;
  onUpdate: (id: string, patch: Partial<Evidencia>) => void;
  onRemove: (id: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Classification | "TODAS">("TODAS");
  const visible = filter === "TODAS" ? items : items.filter((e) => e.clasificacion === filter);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">Sección 3</p>
          <h2 className="font-display text-2xl text-navy text-balance">Registro de evidencias B12</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
            Cada unidad lleva una sola clasificación y un estado de verificación. Trazabilidad
            obligatoria: fuente, fecha y responsable (R11, R14).
          </p>
        </div>
        <Button
          type="button"
          variant="gold"
          onClick={() => {
            const id = onAdd();
            setOpenId(id);
          }}
        >
          <Plus className="size-4" />
          Agregar evidencia
        </Button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter("TODAS")}
          className={`min-h-10 shrink-0 rounded-full px-3 text-xs font-medium ${
            filter === "TODAS" ? "bg-navy text-paper" : "border border-line bg-card text-muted"
          }`}
        >
          Todas ({items.length})
        </button>
        {CLASSIFICATIONS.map((c) => {
          const n = items.filter((e) => e.clasificacion === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`min-h-10 shrink-0 rounded-full px-3 text-xs font-medium ${
                filter === c ? "bg-navy text-paper" : "border border-line bg-card text-muted"
              }`}
            >
              {CLASSIFICATION_META[c].label} ({n})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted">
            Sin evidencias en esta vista. Agregue un registro o cargue el caso Shalom MX.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-navy text-paper">
              <tr className="text-xs tracking-wide uppercase">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Campo</th>
                <th className="px-4 py-3 font-medium">Clasificación</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Fuente</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{e.codigo}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-left font-medium text-navy hover:underline"
                      onClick={() => setOpenId(e.id)}
                    >
                      {e.campo || "Sin campo"}
                    </button>
                    <p className="max-w-xs truncate text-xs text-muted">{e.valor || "DESCONOCIDO"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <ClassBadge value={e.clasificacion} />
                  </td>
                  <td className="px-4 py-3">
                    <StateBadge value={e.verificacion} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{e.fuente || "DESCONOCIDO"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-paper hover:text-danger"
                      onClick={() => {
                        if (window.confirm(`Eliminar ${e.codigo}?`)) onRemove(e.id);
                      }}
                      aria-label={`Eliminar ${e.codigo}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openId ? (
        <EvidenceEditor
          item={items.find((e) => e.id === openId)}
          onClose={() => setOpenId(null)}
          onChange={(patch) => onUpdate(openId, patch)}
        />
      ) : null}
    </section>
  );
}

function EvidenceEditor({
  item,
  onClose,
  onChange,
}: {
  item: Evidencia | undefined;
  onClose: () => void;
  onChange: (patch: Partial<Evidencia>) => void;
}) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-navy/50" aria-label="Cerrar" onClick={onClose} />
      <div
        role="dialog"
        aria-labelledby="ev-title"
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-card p-5 shadow-xl sm:rounded-2xl sm:p-6"
      >
        <h3 id="ev-title" className="font-display text-xl text-navy">
          {item.codigo}
        </h3>
        <p className="mt-1 text-xs text-muted">Una sola clasificación B12. El estado de verificación no la sustituye.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Campo">
            <TextInput value={item.campo} onChange={(e) => onChange({ campo: e.target.value })} />
          </Field>
          <Field label="Fecha">
            <TextInput type="date" value={item.fecha} onChange={(e) => onChange({ fecha: e.target.value })} />
          </Field>
          <Field label="Clasificación B12" className="md:col-span-2">
            <Select
              value={item.clasificacion}
              onChange={(e) => onChange({ clasificacion: e.target.value as Classification })}
            >
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c}>
                  {CLASSIFICATION_META[c].label} — {CLASSIFICATION_META[c].hint}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado de verificación">
            <Select
              value={item.verificacion}
              onChange={(e) => onChange({ verificacion: e.target.value as VerificationState })}
            >
              {VERIFICATION_STATES.map((s) => (
                <option key={s} value={s}>
                  {VERIFICATION_META[s].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Responsable">
            <TextInput
              value={item.responsable}
              onChange={(e) => onChange({ responsable: e.target.value })}
            />
          </Field>
          <Field label="Fuente" className="md:col-span-2">
            <TextInput value={item.fuente} onChange={(e) => onChange({ fuente: e.target.value })} />
          </Field>
          <Field label="Valor" className="md:col-span-2" hint="Vacío = DESCONOCIDO">
            <TextArea value={item.valor} onChange={(e) => onChange({ valor: e.target.value })} />
          </Field>
          <Field label="Observaciones" className="md:col-span-2">
            <TextArea
              value={item.observaciones}
              onChange={(e) => onChange({ observaciones: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="button" variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
