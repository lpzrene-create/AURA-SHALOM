import { CLASSIFICATION_META, VERIFICATION_META, type Classification, type VerificationState } from "@/lib/b12/catalog";
import { cn } from "@/lib/utils";

const toneClass: Record<string, string> = {
  hecho: "bg-b12-hecho-bg text-b12-hecho",
  azul: "bg-b12-azul-bg text-b12-azul",
  gris: "bg-b12-gris-bg text-b12-gris",
  ambar: "bg-b12-ambar-bg text-b12-ambar",
  rojo: "bg-b12-rojo-bg text-b12-rojo",
};

export function ClassBadge({ value }: { value: Classification }) {
  const meta = CLASSIFICATION_META[value];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        toneClass[meta.tone],
      )}
    >
      {meta.label}
    </span>
  );
}

export function StateBadge({ value }: { value: VerificationState }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line px-2 py-0.5 text-[11px] font-medium text-muted">
      {VERIFICATION_META[value].label}
    </span>
  );
}
