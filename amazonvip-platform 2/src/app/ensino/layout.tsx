import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import { getSectorBySlug, ROLE_LABELS } from "@/lib/config/sectors";
import { Sidebar } from "@/components/Sidebar";

const sector = getSectorBySlug("ensino")!;

export default async function EnsinoLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole(["admin", "ensino"]);
  return (
    <div className="min-h-screen bg-neutral-950">
      <Sidebar
        brandName={sector.name}
        brandSub={sector.shortDescription}
        brandIcon={sector.icon}
        accent={sector.accent}
        navItems={sector.nav}
        basePath="/ensino"
        showBackToSectors={profile.role === "admin"}
        userName={profile.full_name}
        roleLabel={ROLE_LABELS[profile.role]}
      />
      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
