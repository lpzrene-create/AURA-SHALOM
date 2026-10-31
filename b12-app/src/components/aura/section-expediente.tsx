import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import type { Expediente, ExpedienteEstado } from "@/lib/b12/types";

const ESTADOS: ExpedienteEstado[] = ["BORRADOR", "ACTIVO", "ARCHIVADO"];

export function SectionExpediente({
  value,
  onChange,
}: {
  value: Expediente;
  onChange: (patch: Partial<Expediente>) => void;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-[0.18em] text-gold uppercase">Sección 1</p>
        <h2 className="font-display text-2xl text-navy text-balance">Datos del expediente</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          Identificación del proyecto. Los campos vacíos se tratan como DESCONOCIDO. Nada de lo
          capturado aquí se promociona a hecho por el solo hecho de escribirse.
        </p>
      </header>

      <div className="rounded-xl border border-line bg-card p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Código" hint="Formato AURA-AAAA-NNNN">
            <TextInput value={value.codigo} readOnly className="font-mono tracking-wide" />
          </Field>
          <Field label="Estado">
            <Select
              value={value.estado}
              onChange={(e) => onChange({ estado: e.target.value as ExpedienteEstado })}
            >
              {ESTADOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nombre del proyecto" className="md:col-span-2">
            <TextInput
              value={value.nombre}
              onChange={(e) => onChange({ nombre: e.target.value })}
              placeholder="Nombre declarado del proyecto"
            />
          </Field>
          <Field label="Negocio">
            <TextInput
              value={value.negocio}
              onChange={(e) => onChange({ negocio: e.target.value })}
              placeholder="Razón o nombre comercial"
            />
          </Field>
          <Field label="Responsable">
            <TextInput
              value={value.responsable}
              onChange={(e) => onChange({ responsable: e.target.value })}
              placeholder="Quien firma la captura"
            />
          </Field>
          <Field label="Giro">
            <TextInput value={value.giro} onChange={(e) => onChange({ giro: e.target.value })} />
          </Field>
          <Field label="Ciudad">
            <TextInput value={value.ciudad} onChange={(e) => onChange({ ciudad: e.target.value })} />
          </Field>
          <Field label="Fecha de apertura">
            <TextInput
              type="date"
              value={value.fecha}
              onChange={(e) => onChange({ fecha: e.target.value })}
            />
          </Field>
          <Field label="Objeto de investigación" className="md:col-span-2">
            <TextArea
              value={value.objeto}
              onChange={(e) => onChange({ objeto: e.target.value })}
              placeholder="Qué se investiga, documenta y verifica. Sin conclusiones."
            />
          </Field>
        </div>
      </div>
    </section>
  );
}
