import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

const ADMIN_NAV = [
  { label: "Início", href: "", icon: "home" },
  { label: "Usuários", href: "usuarios", icon: "users" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole(["admin"]);

  return (
    <div className="min-h-screen bg-neutral-950">
      <Sidebar
        brandName="AmazonVip"
        brandSub="Administração"
        brandIcon="shield"
        accent="amber"
        navItems={ADMIN_NAV}
        basePath="/admin"
        showBackToSectors={true}
        userName={profile.full_name}
        roleLabel="Administrador"
      />
      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
