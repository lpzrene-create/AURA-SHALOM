import { AuraShell } from "@/components/aura/shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AuraShell />;
}
