import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, StatCard, StatusBadge, EmptyState } from "@/components/ui";

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const daysInMonth = end.getDate();
  return { start, end, daysInMonth };
}

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FlutuanteHome() {
  const supabase = await createClient();
  const now = new Date();
  const { start, end, daysInMonth } = monthBounds(now);
  const startISO = start.toISOString().slice(0, 10);
  const endISO = end.toISOString().slice(0, 10);
  const monthLabel = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const [{ data: reservas }, { data: financeiroMes }, { data: clientes }] = await Promise.all([
    supabase.from("flutuante_reservas").select("*").order("checkin", { ascending: true }),
    supabase
      .from("flutuante_financeiro")
      .select("*")
      .gte("data", startISO)
      .lte("data", endISO),
    supabase.from("flutuante_clientes").select("id, created_at"),
  ]);

  const allReservas = reservas ?? [];
  const confirmadas = allReservas.filter((r) => r.status === "confirmada");
  const negociando = allReservas.filter((r) => r.status === "negociando");
  const concluidas = allReservas.filter((r) => r.status === "concluida");
  const canceladas = allReservas.filter((r) => r.status === "cancelada");

  // Ocupação do mês: dias distintos com reserva confirmada dentro do mês atual
  const occupiedDays = new Set<string>();
  for (const r of confirmadas) {
    if (!r.checkin) continue;
    const ci = new Date(Math.max(new Date(r.checkin).getTime(), start.getTime()));
    const co = new Date(Math.min(new Date(r.checkout ?? r.checkin).getTime(), end.getTime()));
    for (let d = new Date(ci); d <= co; d.setDate(d.getDate() + 1)) {
      occupiedDays.add(d.toISOString().slice(0, 10));
    }
  }
  const ocupacaoPct = Math.round((occupiedDays.size / daysInMonth) * 100);

  const receitaMes = (financeiroMes ?? [])
    .filter((f) => f.tipo === "entrada" && f.status === "pago")
    .reduce((sum, f) => sum + Number(f.valor ?? 0), 0);

  const receitaPorCategoria: Record<string, number> = {};
  for (const f of financeiroMes ?? []) {
    if (f.tipo !== "entrada" || f.status !== "pago") continue;
    const cat = f.categoria || "Outros";
    receitaPorCategoria[cat] = (receitaPorCategoria[cat] ?? 0) + Number(f.valor ?? 0);
  }

  const totalClientes = clientes?.length ?? 0;
  const clientesEsteMes = (clientes ?? []).filter(
    (c) => new Date(c.created_at) >= start
  ).length;

  const hojeISO = now.toISOString().slice(0, 10);
  const proximasReservas = allReservas
    .filter((r) => r.checkin && r.checkin >= hojeISO && r.status !== "cancelada")
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Flutuante — Início" subtitle={monthLabel.replace(/^./, (c) => c.toUpperCase())} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="calendar"
          value={String(confirmadas.length)}
          label="Reservas confirmadas"
          hint={`${negociando.length} em negociação`}
        />
        <StatCard
          icon="percent"
          value={`${ocupacaoPct}%`}
          label="Ocupação do mês"
          hint={`${occupiedDays.size}/${daysInMonth} dias`}
        />
        <StatCard
          icon="dollar"
          value={fmtBRL(receitaMes)}
          label="Receita do mês"
          hint="lançamentos pagos"
        />
        <StatCard
          icon="users"
          value={String(totalClientes)}
          label="Clientes"
          hint={`+${clientesEsteMes} este mês`}
        />
      </div>

      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-300 mb-4">Reservas por status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-lg font-semibold text-neutral-100">{confirmadas.length}</span>
            <span className="text-xs text-neutral-500">Confirmadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-lg font-semibold text-neutral-100">{negociando.length}</span>
            <span className="text-xs text-neutral-500">Negociando</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <span className="text-lg font-semibold text-neutral-100">{concluidas.length}</span>
            <span className="text-xs text-neutral-500">Concluídas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-lg font-semibold text-neutral-100">{canceladas.length}</span>
            <span className="text-xs text-neutral-500">Canceladas</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">Próximas reservas</h2>
          {proximasReservas.length === 0 ? (
            <EmptyState icon="calendar" text="Nenhuma reserva futura." />
          ) : (
            <div className="flex flex-col gap-3">
              {proximasReservas.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-neutral-200">{r.cliente_nome}</div>
                    <div className="text-xs text-neutral-500">
                      {r.checkin} {r.cabine ? `· ${r.cabine}` : ""}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">Receita por categoria (mês)</h2>
          {Object.keys(receitaPorCategoria).length === 0 ? (
            <EmptyState icon="dollar" text="Sem receitas no mês." />
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(receitaPorCategoria).map(([cat, valor]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">{cat}</span>
                  <span className="text-sm font-medium text-neutral-100">{fmtBRL(valor)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Link
        href="/flutuante/reservas"
        className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-amber-400 hover:text-amber-300"
      >
        Ver todas as reservas →
      </Link>
    </div>
  );
}
