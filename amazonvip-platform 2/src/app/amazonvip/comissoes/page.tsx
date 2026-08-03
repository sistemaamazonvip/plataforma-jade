import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarComissao } from "../actions";

export default async function ComissoesPage() {
  const supabase = await createClient();
  const { data: comissoes } = await supabase
    .from("amazonvip_comissoes")
    .select("*")
    .order("produto", { ascending: true });
  const rows = comissoes ?? [];

  return (
    <div>
      <PageHeader title="Comissões" subtitle="Regras de comissão por pacote" />

      <NewItemPanel label="Nova regra" accent="orange" action={criarComissao}>
        <Field label="Produto/Pacote"><Input name="produto" required /></Field>
        <Field label="Percentual (%)"><Input type="number" step="0.01" name="percentual" required /></Field>
        <Field label="Ativo">
          <Select name="ativo" defaultValue="true">
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="percent" text="Nenhuma regra de comissão cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Percentual</Th>
                <Th>Situação</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.produto}</Td>
                  <Td>{Number(c.percentual)}%</Td>
                  <Td><StatusBadge status={c.ativo ? "ativo" : "encerrado"} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
