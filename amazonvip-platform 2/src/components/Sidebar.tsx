"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { getAccent } from "@/lib/config/accent";
import { logout } from "@/app/login/actions";
import { useState } from "react";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  brandName: string;
  brandSub: string;
  brandIcon: string;
  accent: string;
  navItems: SidebarNavItem[];
  basePath: string;
  showBackToSectors?: boolean;
  userName: string;
  roleLabel: string;
}

export function Sidebar({
  brandName,
  brandSub,
  brandIcon,
  accent,
  navItems,
  basePath,
  showBackToSectors,
  userName,
  roleLabel,
}: SidebarProps) {
  const pathname = usePathname();
  const a = getAccent(accent);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const content = (
    <>
      <div className="flex items-center gap-3 px-2 pb-6 mb-2 border-b border-neutral-800">
        <div className={`w-9 h-9 rounded-lg ${a.iconGradient} flex items-center justify-center flex-none`}>
          <Icon name={brandIcon} size={18} className="text-neutral-950" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-neutral-100 truncate">{brandName}</div>
          <div className="text-[11px] text-neutral-500 truncate">{brandSub}</div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const href = item.href ? `${basePath}/${item.href}` : basePath;
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? `${a.activeBg} ${a.activeText} ${a.activeGlow}`
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-neutral-800 flex flex-col gap-1">
        {showBackToSectors && (
          <Link
            href="/setores"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition"
          >
            <Icon name="grid" size={17} />
            Voltar aos setores
          </Link>
        )}

        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-300 flex-none">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-neutral-200 truncate">{userName}</div>
            <div className="text-[10.5px] text-neutral-500 truncate">{roleLabel}</div>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-red-950/40 hover:text-red-400 transition"
          >
            <Icon name="logout" size={17} />
            Sair
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Botão mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300"
        aria-label="Abrir menu"
      >
        <Icon name="grid" size={18} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col p-4 z-50 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
