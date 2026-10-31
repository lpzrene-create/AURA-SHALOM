import { SectionAlcance } from "@/components/aura/section-alcance";
import { SectionDictamen } from "@/components/aura/section-dictamen";
import { SectionEvidencias } from "@/components/aura/section-evidencias";
import { SectionExpediente } from "@/components/aura/section-expediente";
import { Button } from "@/components/ui/button";
import { APP_NAME, COMPANY, MOTTO, TAGLINE } from "@/lib/b12/catalog";
import { useAuraStore } from "@/lib/b12/store";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Download,
  FileSearch,
  FolderOpen,
  Scale,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { id: "expediente", label: "Expediente", icon: FolderOpen },
  { id: "alcance", label: "Alcance", icon: Scale },
  { id: "evidencias", label: "Evidencias", icon: ClipboardList },
  { id: "dictamen", label: "Dictamen", icon: FileSearch },
] as const;

type SectionId = (typeof NAV)[number]["id"];

export function AuraShell() {
  const store = useAuraStore();
  const [section, setSection] = useState<SectionId>("expediente");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    useAuraStore.getState().hydrate();
  }, []);

  function exportJson() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            v: 5,
            expediente: store.expediente,
            evidencias: store.evidencias,
            alcance: store.alcance,
            evaluacion: store.evaluacion,
            versiones: store.versiones,
            updatedAt: store.updatedAt,
            dirty: store.dirty,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${store.expediente.codigo || "aura"}-expediente.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-3 focus:py-2"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-navy/20 bg-navy text-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <img
            src="/brand-seal.png"
            alt="Sello Servicios Shalom"
            className="size-12 rounded-full border border-gold/50 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">{COMPANY}</p>
            <h1 className="truncate font-display text-lg leading-tight md:text-xl">{APP_NAME}</h1>
            <p className="hidden text-xs text-paper/70 sm:block">{TAGLINE}</p>
          </div>
          <span className="hidden rounded-full border border-ok/40 px-2.5 py-1 text-[10px] tracking-widest text-ok uppercase md:inline">
            Offline
          </span>
        </div>
        <div className="bg-gold text-navy">
          <p className="mx-auto max-w-6xl px-4 py-1.5 text-center text-[11px] font-semibold tracking-[0.22em]">
            {MOTTO}
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <nav
          aria-label="Secciones"
          className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur md:top-0 md:w-56 md:shrink-0 md:border-b-0 md:border-r md:bg-transparent"
        >
          <div className="flex gap-1 overflow-x-auto px-2 py-2 md:flex-col md:px-3 md:py-6">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                    active ? "bg-navy text-paper" : "text-muted hover:bg-card hover:text-ink"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
            <Link
              to="/traspaso"
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted hover:bg-card hover:text-ink"
            >
              <BookOpen className="size-4" />
              Traspaso
            </Link>
          </div>
        </nav>

        <main id="contenido" className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          {section === "expediente" ? (
            <SectionExpediente value={store.expediente} onChange={store.setExpediente} />
          ) : null}
          {section === "alcance" ? (
            <SectionAlcance
              value={store.alcance}
              onChange={store.setAlcance}
              onSave={() => store.snapshot("Decisión de alcance comercial")}
            />
          ) : null}
          {section === "evidencias" ? (
            <SectionEvidencias
              items={store.evidencias}
              onAdd={store.addEvidencia}
              onUpdate={store.updateEvidencia}
              onRemove={store.removeEvidencia}
            />
          ) : null}
          {section === "dictamen" ? (
            <SectionDictamen
              evaluacion={store.evaluacion}
              dirty={store.dirty}
              onRun={() => {
                store.evaluar();
                setSection("dictamen");
              }}
            />
          ) : null}

          <footer className="mt-10 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap">
            <Button type="button" variant="outline" onClick={store.loadDemo}>
              Cargar caso Shalom MX
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (window.confirm("¿Vaciar el expediente local?")) store.reset();
              }}
            >
              Nuevo expediente
            </Button>
            <Button type="button" variant="outline" onClick={exportJson}>
              <Download className="size-4" />
              Exportar JSON
            </Button>
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              Importar
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  const raw = JSON.parse(await file.text());
                  const err = store.importPayload(raw);
                  if (err) window.alert(err);
                } catch {
                  window.alert("JSON inválido.");
                }
              }}
            />
            <p className="sm:ml-auto self-center text-xs text-muted">
              Guardado automático
              {store.hydrated && store.expediente.codigo ? ` · ${store.expediente.codigo}` : ""}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
