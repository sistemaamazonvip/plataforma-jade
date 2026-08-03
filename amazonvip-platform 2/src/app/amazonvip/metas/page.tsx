import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarMeta } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function MetasPage() {
  const supabase = await createClient();
  const [{ data: metas }, { data: vendas }] = await Promise.all([
    supabase.from("amazonvip_metas").select("*").order("mes", { ascending: false }),
    supabase.from("amazonvip_vendas").select("vendedor, valor, data, status"),
  ]);
  const rows = metas ?? [];
  const vendasRows = vendas ?? [];

  const realizado = (vendedor: string, mes: string) =>
    vendasRows
      .filter((v) => v.vendedor === vendedor && v.status !== "cancelada" && String(v.data ?? "").slice(0, 7) === mes)
      .reduce((s, v) => s + Number(v.valor), 0);

  return (
    <div>
      <PageHeader title="Metas" subtitle="Acompanhamento de metas do time comercial" />

      <NewItemPanel label="Nova meta" accent="orange" action={criarMeta}>
        <Field label="Vendedor"><Input name="vendedor" required /></Field>
        <Field label="Mês (AAAA-MM)"><Input name="mes" placeholder="2026-08" required /></Field>
        <Field label="Meta (R$)"><Input type="number" step="0.01" name="meta_valor" required /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="target" text="Nenhuma meta cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Vendedor</Th>
                <Th>Mês</Th>
                <Th>Meta</Th>
                <Th>Realizado</Th>
                <Th>Progresso</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const feito = realizado(m.vendedor, m.mes);
                const pct = Number(m.meta_valor) > 0 ? Math.min(100, Math.round((feito / Number(m.meta_valor)) * 100)) : 0;
                return (
                  <tr key={m.id}>
                    <Td className="font-medium text-neutral-100">{m.vendedor}</Td>
                    <Td>{m.mes}</Td>
                    <Td>{fmtBRL(Number(m.meta_valor))}</Td>
                    <Td>{fmtBRL(feito)}</Td>
                    <Td>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                          <div className="h-full bg-orange-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 w-10 text-right">{pct}%</span>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
