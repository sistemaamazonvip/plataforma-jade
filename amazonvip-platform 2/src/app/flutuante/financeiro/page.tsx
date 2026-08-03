import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, StatCard, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarLancamento } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("flutuante_financeiro")
    .select("*")
    .order("data", { ascending: false });

  const rows = lancamentos ?? [];
  const entradas = rows.filter((r) => r.tipo === "entrada" && r.status === "pago").reduce((s, r) => s + Number(r.valor), 0);
  const saidas = rows.filter((r) => r.tipo === "saida" && r.status === "pago").reduce((s, r) => s + Number(r.valor), 0);
  const pendentes = rows.filter((r) => r.status === "pendente").reduce((s, r) => s + Number(r.valor), 0);

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Lançamentos do Flutuante" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon="dollar" value={fmtBRL(entradas)} label="Entradas (pagas)" />
        <StatCard icon="dollar" value={fmtBRL(saidas)} label="Saídas (pagas)" />
        <StatCard icon="dollar" value={fmtBRL(pendentes)} label="Pendente" />
      </div>

      <NewItemPanel label="Novo lançamento" action={criarLancamento}>
        <Field label="Descrição"><Input name="descricao" required /></Field>
        <Field label="Categoria"><Input name="categoria" placeholder="Ex: Hospedagem, Manutenção..." /></Field>
        <Field label="Tipo">
          <Select name="tipo" defaultValue="entrada">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue="pendente">
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </Select>
        </Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" required /></Field>
        <Field label="Data"><Input type="date" name="data" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="dollar" text="Nenhum lançamento cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Descrição</Th>
                <Th>Categoria</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium text-neutral-100">{r.descricao}</Td>
                  <Td>{r.categoria ?? "—"}</Td>
                  <Td><StatusBadge status={r.tipo} /></Td>
                  <Td>{fmtBRL(Number(r.valor))}</Td>
                  <Td>{r.data}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
