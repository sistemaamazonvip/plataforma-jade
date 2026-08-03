import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarLancamentoGeral } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function LancamentosPage() {
  const supabase = await createClient();
  const { data: lancamentos } = await supabase
    .from("financeiro_lancamentos")
    .select("*")
    .order("data", { ascending: false });
  const rows = lancamentos ?? [];

  return (
    <div>
      <PageHeader title="Lançamentos" subtitle="Entradas e saídas por centro de custo e banco" />

      <NewItemPanel label="Novo lançamento" accent="emerald" action={criarLancamentoGeral}>
        <Field label="Descrição"><Input name="descricao" required /></Field>
        <Field label="Centro de custo"><Input name="centro_custo" /></Field>
        <Field label="Banco"><Input name="banco" /></Field>
        <Field label="Tipo">
          <Select name="tipo" defaultValue="entrada">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
        </Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" required /></Field>
        <Field label="Data"><Input type="date" name="data" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="receipt" text="Nenhum lançamento cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Descrição</Th>
                <Th>Centro de custo</Th>
                <Th>Banco</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
                <Th>Data</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium text-neutral-100">{r.descricao}</Td>
                  <Td>{r.centro_custo ?? "—"}</Td>
                  <Td>{r.banco ?? "—"}</Td>
                  <Td><StatusBadge status={r.tipo} /></Td>
                  <Td>{fmtBRL(Number(r.valor))}</Td>
                  <Td>{r.data}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
