// Mapeamento de classes Tailwind por cor de destaque (accent) de cada setor.
// Escrito com classes literais (não interpoladas) para o Tailwind conseguir
// detectar e gerar o CSS corretamente.

export type Accent =
  | "amber"
  | "sky"
  | "fuchsia"
  | "cyan"
  | "emerald"
  | "violet"
  | "orange";

interface AccentClasses {
  activeBg: string; // fundo do item de menu ativo
  activeText: string;
  activeGlow: string; // sombra do item ativo
  iconGradient: string; // ícone do item ativo / avatar
  badgeBg: string;
  badgeText: string;
  ring: string;
  dot: string;
  buttonBg: string;
  buttonText: string;
}

export const ACCENTS: Record<Accent, AccentClasses> = {
  amber: {
    activeBg: "bg-amber-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-amber-500/30",
    iconGradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    ring: "focus:ring-amber-500/30 focus:border-amber-500/60",
    dot: "bg-amber-400",
    buttonBg: "bg-gradient-to-r from-amber-400 to-amber-500",
    buttonText: "text-neutral-950",
  },
  sky: {
    activeBg: "bg-sky-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-sky-500/30",
    iconGradient: "bg-gradient-to-br from-sky-400 to-sky-600",
    badgeBg: "bg-sky-500/15",
    badgeText: "text-sky-400",
    ring: "focus:ring-sky-500/30 focus:border-sky-500/60",
    dot: "bg-sky-400",
    buttonBg: "bg-gradient-to-r from-sky-400 to-sky-500",
    buttonText: "text-neutral-950",
  },
  fuchsia: {
    activeBg: "bg-fuchsia-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-fuchsia-500/30",
    iconGradient: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
    badgeBg: "bg-fuchsia-500/15",
    badgeText: "text-fuchsia-400",
    ring: "focus:ring-fuchsia-500/30 focus:border-fuchsia-500/60",
    dot: "bg-fuchsia-400",
    buttonBg: "bg-gradient-to-r from-fuchsia-400 to-fuchsia-500",
    buttonText: "text-neutral-950",
  },
  cyan: {
    activeBg: "bg-cyan-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-cyan-500/30",
    iconGradient: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-400",
    ring: "focus:ring-cyan-500/30 focus:border-cyan-500/60",
    dot: "bg-cyan-400",
    buttonBg: "bg-gradient-to-r from-cyan-400 to-cyan-500",
    buttonText: "text-neutral-950",
  },
  emerald: {
    activeBg: "bg-emerald-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-emerald-500/30",
    iconGradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
    ring: "focus:ring-emerald-500/30 focus:border-emerald-500/60",
    dot: "bg-emerald-400",
    buttonBg: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    buttonText: "text-neutral-950",
  },
  violet: {
    activeBg: "bg-violet-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-violet-500/30",
    iconGradient: "bg-gradient-to-br from-violet-400 to-violet-600",
    badgeBg: "bg-violet-500/15",
    badgeText: "text-violet-400",
    ring: "focus:ring-violet-500/30 focus:border-violet-500/60",
    dot: "bg-violet-400",
    buttonBg: "bg-gradient-to-r from-violet-400 to-violet-500",
    buttonText: "text-neutral-950",
  },
  orange: {
    activeBg: "bg-orange-400",
    activeText: "text-neutral-950",
    activeGlow: "shadow-lg shadow-orange-500/30",
    iconGradient: "bg-gradient-to-br from-orange-400 to-orange-600",
    badgeBg: "bg-orange-500/15",
    badgeText: "text-orange-400",
    ring: "focus:ring-orange-500/30 focus:border-orange-500/60",
    dot: "bg-orange-400",
    buttonBg: "bg-gradient-to-r from-orange-400 to-orange-500",
    buttonText: "text-neutral-950",
  },
};

export function getAccent(accent: string): AccentClasses {
  return ACCENTS[(accent as Accent) in ACCENTS ? (accent as Accent) : "amber"];
}
