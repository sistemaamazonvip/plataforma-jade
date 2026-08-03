import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, StatCard, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarConta } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ContasPage() {
  const supabase = await createClient();
  const [{ data: contas }, { data: lancamentos }] = await Promise.all([
    supabase.from("financeiro_contas").select("*").order("banco", { ascending: true }),
    supabase.from("financeiro_lancamentos").select("banco, tipo, valor"),
  ]);
  const rows = contas ?? [];
  const movs = lancamentos ?? [];

  const saldoPorBanco = (banco: string) => {
    const inicial = rows.find((c) => c.banco === banco)?.saldo_inicial ?? 0;
    const delta = movs
      .filter((m) => m.banco === banco)
      .reduce((s, m) => s + (m.tipo === "entrada" ? Number(m.valor) : -Number(m.valor)), 0);
    return Number(inicial) + delta;
  };

  const saldoTotal = rows.reduce((s, c) => s + saldoPorBanco(c.banco), 0);

  return (
    <div>
      <PageHeader title="Contas Bancárias" subtitle="Saldo consolidado por banco" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="bank" value={fmtBRL(saldoTotal)} label="Saldo consolidado" />
        <StatCard icon="dollar" value={String(rows.length)} label="Contas cadastradas" />
      </div>

      <NewItemPanel label="Nova conta" action={criarConta}>
        <Field label="Banco"><Input name="banco" required /></Field>
        <Field label="Agência"><Input name="agencia" /></Field>
        <Field label="Conta"><Input name="conta" /></Field>
        <Field label="Saldo inicial (R$)"><Input type="number" step="0.01" name="saldo_inicial" defaultValue={0} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="bank" text="Nenhuma conta cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Banco</Th>
                <Th>Agência</Th>
                <Th>Conta</Th>
                <Th>Saldo atual</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.banco}</Td>
                  <Td>{c.agencia ?? "—"}</Td>
                  <Td>{c.conta ?? "—"}</Td>
                  <Td>{fmtBRL(saldoPorBanco(c.banco))}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
