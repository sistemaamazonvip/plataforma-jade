import type { SVGProps } from "react";

const PATHS: Record<string, string> = {
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  calendar: "M3 4h18v17H3zM8 2v4M16 2v4M3 10h18",
  tasks: "M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z",
  users: "M9 9a3 3 0 100-6 3 3 0 000 6zM2.5 20c0-3.3 3-5.7 6.5-5.7s6.5 2.4 6.5 5.7M17.5 9.6a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2zM16 14c2.6.5 4.5 2.4 4.5 5.7",
  handshake: "M3 11l9-8 9 8M5 10v10h14V10M9 15l3-3 3 3",
  dollar: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v10M9.5 9.5c0-1.4 1.2-2 2.5-2s2.5.7 2.5 2c0 3-5 1.5-5 4.5 0 1.3 1.2 2 2.5 2s2.5-.6 2.5-2",
  box: "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10",
  tag: "M20.6 12.6l-8-8a2 2 0 00-2.8 0l-6.4 6.4a2 2 0 000 2.8l8 8a2 2 0 002.8 0l6.4-6.4a2 2 0 000-2.8zM8.5 8.5h.01",
  cap: "M12 3L2 8l10 5 10-5-10-5zM6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5",
  doc: "M7 3h7l5 5v13H7z",
  check: "M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z",
  megaphone: "M3 11v4a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1zM16 8a4 4 0 010 8",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.4 5h13.2L22 12v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7L5.4 5z",
  suitcase: "M4 7h16v12H4zM9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M4 12h16",
  route: "M2 15h20M4 15V9l4-4h8l4 4v6M8 19h.01M16 19h.01",
  receipt: "M7 3h7l5 5v13H7z",
  layers: "M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5",
  bank: "M3 21h18M4 21V9l8-6 8 6v12M9 21v-8M15 21v-8",
  chart: "M3 17l6-6 4 4 8-8M4 21h16",
  flow: "M6 3h4v4H6zM14 17h4v4h-4zM8 7v6a2 2 0 002 2h4M18 7v0",
  table: "M3 4h18v17H3zM3 10h18M9 4v17",
  history: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 3",
  cart: "M2 4h3l2.5 12h10L20 8H6",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 13a1 1 0 100-2 1 1 0 000 2z",
  percent: "M19 5L5 19M7.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM16.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4-4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2.8 17a1.7 1.7 0 001.5 2.5h15.4a1.7 1.7 0 001.5-2.5L13.7 3.9a1.7 1.7 0 00-3.4 0z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  building: "M3 21h18M6 21V7l6-4 6 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01",
  shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  x: "M18 6L6 18M6 6l12 12",
  chevronLeft: "M15 6l-6 6 6 6",
  refresh: "M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-5.3M20 14a8 8 0 01-14 5.3",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof PATHS | string;
  size?: number;
}

export function Icon({ name, size = 18, ...props }: IconProps) {
  const d = PATHS[name] ?? PATHS.tag;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
