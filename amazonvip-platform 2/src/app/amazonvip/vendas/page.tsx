import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarVenda } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function VendasPage() {
  const supabase = await createClient();
  const { data: vendas } = await supabase
    .from("amazonvip_vendas")
    .select("*")
    .order("data", { ascending: false });
  const rows = vendas ?? [];

  return (
    <div>
      <PageHeader title="Vendas" subtitle="Lançamento e controle de vendas" />

      <NewItemPanel label="Nova venda" accent="orange" action={criarVenda}>
        <Field label="Cliente"><Input name="cliente" required /></Field>
        <Field label="Produto/Pacote"><Input name="produto" required /></Field>
        <Field label="Vendedor"><Input name="vendedor" /></Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" required /></Field>
        <Field label="Data"><Input type="date" name="data" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="confirmada">
            <option value="confirmada">Confirmada</option>
            <option value="pendente">Pendente</option>
            <option value="cancelada">Cancelada</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="cart" text="Nenhuma venda lançada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Produto</Th>
                <Th>Vendedor</Th>
                <Th>Valor</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id}>
                  <Td className="font-medium text-neutral-100">{v.cliente}</Td>
                  <Td>{v.produto}</Td>
                  <Td>{v.vendedor ?? "—"}</Td>
                  <Td>{fmtBRL(Number(v.valor))}</Td>
                  <Td>{v.data}</Td>
                  <Td><StatusBadge status={v.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
