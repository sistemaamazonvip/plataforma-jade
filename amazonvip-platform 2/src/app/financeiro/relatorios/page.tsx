import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, StatCard, Table, Th, Td, EmptyState } from "@/components/ui";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function RelatoriosPage() {
  const supabase = await createClient();
  const { data: lancamentos } = await supabase.from("financeiro_lancamentos").select("*");
  const rows = lancamentos ?? [];

  const entradas = rows.filter((r) => r.tipo === "entrada").reduce((s, r) => s + Number(r.valor), 0);
  const saidas = rows.filter((r) => r.tipo === "saida").reduce((s, r) => s + Number(r.valor), 0);
  const saldo = entradas - saidas;

  const porCentro = new Map<string, { entradas: number; saidas: number }>();
  for (const r of rows) {
    const key = r.centro_custo ?? "Sem centro de custo";
    const cur = porCentro.get(key) ?? { entradas: 0, saidas: 0 };
    if (r.tipo === "entrada") cur.entradas += Number(r.valor);
    else cur.saidas += Number(r.valor);
    porCentro.set(key, cur);
  }
  const centrosList = Array.from(porCentro.entries());

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Relatórios financeiros consolidados" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="dollar" value={fmtBRL(entradas)} label="Total de entradas" />
        <StatCard icon="dollar" value={fmtBRL(saidas)} label="Total de saídas" />
        <StatCard icon="chart" value={fmtBRL(saldo)} label="Saldo do período" />
      </div>

      <Card className="p-0">
        {centrosList.length === 0 ? (
          <EmptyState icon="chart" text="Nenhum lançamento registrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Centro de custo</Th>
                <Th>Entradas</Th>
                <Th>Saídas</Th>
                <Th>Saldo</Th>
              </tr>
            </thead>
            <tbody>
              {centrosList.map(([nome, v]) => (
                <tr key={nome}>
                  <Td className="font-medium text-neutral-100">{nome}</Td>
                  <Td>{fmtBRL(v.entradas)}</Td>
                  <Td>{fmtBRL(v.saidas)}</Td>
                  <Td>{fmtBRL(v.entradas - v.saidas)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
