import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarCentroCusto } from "../actions";

export default async function CentrosDeCustoPage() {
  const supabase = await createClient();
  const { data: centros } = await supabase
    .from("financeiro_centros_custo")
    .select("*")
    .order("nome", { ascending: true });
  const rows = centros ?? [];

  return (
    <div>
      <PageHeader title="Centros de Custo" subtitle="Estrutura e classificação de centros de custo" />

      <NewItemPanel label="Novo centro de custo" accent="emerald" action={criarCentroCusto}>
        <Field label="Nome"><Input name="nome" required /></Field>
        <Field label="Responsável"><Input name="responsavel" /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="layers" text="Nenhum centro de custo cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Responsável</Th>
                <Th>Descrição</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.nome}</Td>
                  <Td>{c.responsavel ?? "—"}</Td>
                  <Td>{c.descricao ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
