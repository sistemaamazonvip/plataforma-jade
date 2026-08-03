import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { SECTORS, getSectorByRole } from "@/lib/config/sectors";
import { getAccent } from "@/lib/config/accent";
import { Card, PageHeader } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function SetoresPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  if (profile.role !== "admin") {
    const sector = getSectorByRole(profile.role);
    redirect(sector ? `/${sector.slug}` : "/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-5 sm:px-8 py-8 max-w-6xl mx-auto">
      <PageHeader
        title="Setores"
        subtitle="Escolha um setor para visualizar como administrador"
        action={
          <Link
            href="/admin"
            className="text-sm text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5"
          >
            <Icon name="shield" size={15} /> Painel do administrador
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTORS.map((s) => {
          const a = getAccent(s.accent);
          return (
            <Link key={s.slug} href={`/${s.slug}`}>
              <Card className="hover:border-neutral-700 transition h-full">
                <div className={`w-10 h-10 rounded-lg ${a.iconGradient} flex items-center justify-center mb-3`}>
                  <Icon name={s.icon} size={18} className="text-neutral-950" />
                </div>
                <div className="font-medium text-neutral-100 text-sm mb-1">{s.name}</div>
                <div className="text-xs text-neutral-500">{s.shortDescription}</div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
