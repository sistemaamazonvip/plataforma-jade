import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarPreco } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function PrecosPage() {
  const supabase = await createClient();
  const { data: precos } = await supabase
    .from("flutuante_precos")
    .select("*")
    .order("item", { ascending: true });

  const rows = precos ?? [];

  return (
    <div>
      <PageHeader title="Tabela de Preços" subtitle="Valores praticados no Flutuante" />

      <NewItemPanel label="Novo item de preço" action={criarPreco}>
        <Field label="Item"><Input name="item" required /></Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" required /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="tag" text="Nenhum preço cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Descrição</Th>
                <Th>Valor</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium text-neutral-100">{p.item}</Td>
                  <Td>{p.descricao ?? "—"}</Td>
                  <Td>{fmtBRL(Number(p.valor))}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
