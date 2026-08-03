import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { getAccent } from "@/lib/config/accent";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-neutral-50">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  icon,
  value,
  label,
  hint,
  accent = "amber",
}: {
  icon: string;
  value: string;
  label: string;
  hint?: string;
  accent?: string;
}) {
  const a = getAccent(accent);
  return (
    <Card className="flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg ${a.badgeBg} flex items-center justify-center`}>
        <Icon name={icon} size={17} className={a.badgeText} />
      </div>
      <div>
        <div className="text-2xl font-semibold text-neutral-50">{value}</div>
        <div className="text-sm text-neutral-400">{label}</div>
        {hint && <div className="text-xs text-neutral-600 mt-0.5">{hint}</div>}
      </div>
    </Card>
  );
}

const STATUS_STYLES: Record<string, string> = {
  confirmada: "bg-emerald-500/15 text-emerald-400",
  negociando: "bg-amber-500/15 text-amber-400",
  concluida: "bg-neutral-500/15 text-neutral-400",
  cancelada: "bg-red-500/15 text-red-400",
  pendente: "bg-amber-500/15 text-amber-400",
  em_andamento: "bg-sky-500/15 text-sky-400",
  pago: "bg-emerald-500/15 text-emerald-400",
  entrada: "bg-emerald-500/15 text-emerald-400",
  saida: "bg-red-500/15 text-red-400",
  ativo: "bg-emerald-500/15 text-emerald-400",
  ativa: "bg-emerald-500/15 text-emerald-400",
  encerrado: "bg-neutral-500/15 text-neutral-400",
  planejado: "bg-sky-500/15 text-sky-400",
  planejada: "bg-sky-500/15 text-sky-400",
  pausada: "bg-amber-500/15 text-amber-400",
};

const STATUS_LABELS: Record<string, string> = {
  confirmada: "Confirmada",
  negociando: "Negociando",
  concluida: "Concluída",
  cancelada: "Cancelada",
  pendente: "Pendente",
  em_andamento: "Em andamento",
  pago: "Pago",
  entrada: "Entrada",
  saida: "Saída",
  ativo: "Ativo",
  ativa: "Ativa",
  encerrado: "Encerrado",
  planejado: "Planejado",
  planejada: "Planejada",
  pausada: "Pausada",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-neutral-500/15 text-neutral-400"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({ icon = "box", text }: { icon?: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-neutral-600">
      <Icon name={icon} size={28} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="text-left font-medium text-neutral-500 text-xs uppercase tracking-wide px-5 py-2.5 border-b border-neutral-800">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-5 py-3 border-b border-neutral-800/60 text-neutral-300 ${className}`}>
      {children}
    </td>
  );
}

export function Button({
  children,
  variant = "primary",
  accent = "amber",
  type = "button",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  accent?: string;
  type?: "button" | "submit";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const a = getAccent(accent);
  const base =
    variant === "primary"
      ? `${a.buttonBg} ${a.buttonText} font-semibold hover:brightness-110`
      : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700";
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 w-full ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 w-full ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 w-full ${props.className ?? ""}`}
    />
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-400">{label}</label>
      {children}
    </div>
  );
}
