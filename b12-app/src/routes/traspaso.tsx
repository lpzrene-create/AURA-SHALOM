import { APP_NAME, AUTHOR, COMPANY, HANDOFF_TITLE, MOTTO, PHONE, REGLAS_B12, WEB } from "@/lib/b12/catalog";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traspaso")({ component: TraspasoPage });

function TraspasoPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-navy bg-navy text-paper">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-gold uppercase">{COMPANY}</p>
            <h1 className="font-display text-2xl">{HANDOFF_TITLE}</h1>
          </div>
          <Link to="/" className="shrink-0 text-sm text-gold hover:underline">
            Volver
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 text-sm leading-relaxed">
        <p>
          Respaldo operativo para que cualquier persona del equipo use {APP_NAME} sin leer el
          código. Autor del sistema: {AUTHOR}. {MOTTO}.
        </p>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Qué es y qué no es</h2>
          <p>
            Expediente metodológico B12: captura evidencias, las clasifica y emite un dictamen
            epistemológico. No es un CRM, no cotiza en firme y no llama a ninguna IA. Todo vive en
            este dispositivo (localStorage). Offline.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Las cuatro secciones</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Datos del expediente.</strong> Identificación. Vacío = DESCONOCIDO.
            </li>
            <li>
              <strong>Alcance comercial orientativo.</strong> Cuatro sliders, nivel y costo desde
              JSON. Nunca entra al dictamen (R05, R06, R16).
            </li>
            <li>
              <strong>Registro de evidencias B12.</strong> Nueve clasificaciones y seis estados de
              verificación.
            </li>
            <li>
              <strong>Dictamen epistemológico.</strong> NO DETERMINADO / CONDICIONAL / VERIFICADO.
              El índice de soporte permanece NO DETERMINADO por decisión metodológica.
            </li>
          </ol>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Cómo evaluar</h2>
          <p>
            Agregue evidencias y pulse Ejecutar evaluación. Si hay carencia, contradicción,
            desconocido o no determinado: dictamen NO DETERMINADO. Si todas son HECHO: VERIFICADO.
            El caso Shalom MX debe producir NO DETERMINADO y cuello INDETERMINADO POR CARENCIA DE
            INFORMACIÓN.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Las 17 reglas (texto congelado)</h2>
          <ol className="space-y-1">
            {REGLAS_B12.map((r) => (
              <li key={r.codigo}>
                <span className="font-mono text-xs text-gold">{r.codigo}</span> {r.texto}
              </li>
            ))}
          </ol>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Guardado, versiones y PWA</h2>
          <p>
            Autoguardado en el navegador. Exportar JSON para respaldo. Cada evaluación deja una
            versión consultable (R17). Iconos:{" "}
            <a className="text-navy underline" href="/generate_icons.html">
              generate_icons.html
            </a>
            .
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Publicación y APK</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Publique el sitio en HTTPS.</li>
            <li>Confirme el manifiesto PWA.</li>
            <li>En PWABuilder genere el paquete Android (Android 15 / API 35).</li>
            <li>Firme el AAB/APK y pruébelo en HyperOS / Android 15.</li>
            <li>No requiere servidor propio: captura y dictamen son locales.</li>
          </ol>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl text-navy">Contacto</h2>
          <p>
            {COMPANY} · {WEB} · {PHONE}
          </p>
        </section>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-md bg-navy px-4 text-sm font-medium text-paper"
        >
          Volver al expediente
        </Link>
      </article>
    </div>
  );
}
