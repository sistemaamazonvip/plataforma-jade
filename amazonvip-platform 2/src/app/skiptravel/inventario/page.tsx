import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarInventarioViagem } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function InventarioSkipTravelPage() {
  const supabase = await createClient();
  const { data: inventario } = await supabase
    .from("skiptravel_inventario")
    .select("*")
    .order("data_saida", { ascending: true });
  const rows = inventario ?? [];

  return (
    <div>
      <PageHeader title="Inventário" subtitle="Vagas disponíveis por pacote e data" />

      <NewItemPanel label="Novo pacote" accent="cyan" action={criarInventarioViagem}>
        <Field label="Pacote"><Input name="pacote" required /></Field>
        <Field label="Data de saída"><Input type="date" name="data_saida" /></Field>
        <Field label="Vagas totais"><Input type="number" name="vagas_total" /></Field>
        <Field label="Vagas disponíveis"><Input type="number" name="vagas_disponiveis" /></Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="suitcase" text="Nenhum pacote cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Pacote</Th>
                <Th>Data de saída</Th>
                <Th>Vagas</Th>
                <Th>Valor</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium text-neutral-100">{r.pacote}</Td>
                  <Td>{r.data_saida ?? "—"}</Td>
                  <Td>{r.vagas_disponiveis}/{r.vagas_total}</Td>
                  <Td>{fmtBRL(Number(r.valor ?? 0))}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
