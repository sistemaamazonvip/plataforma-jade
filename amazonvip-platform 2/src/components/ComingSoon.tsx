import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/ui";

export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-600 border border-dashed border-neutral-800 rounded-2xl">
        <Icon name="tasks" size={28} />
        <p className="text-sm text-neutral-500">Esta página ainda está em construção.</p>
        <p className="text-xs text-neutral-600 max-w-sm text-center">
          A navegação e a proteção por cargo já funcionam aqui — falta apenas ligar
          este espaço a uma tabela e formulário reais, como foi feito no setor Flutuante.
        </p>
      </div>
    </div>
  );
}
