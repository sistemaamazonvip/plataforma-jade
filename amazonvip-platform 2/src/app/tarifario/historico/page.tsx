import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarHistoricoAlteracao } from "../actions";

export default async function HistoricoPage() {
  const supabase = await createClient();
  const { data: historico } = await supabase
    .from("tarifario_historico")
    .select("*")
    .order("data", { ascending: false });
  const rows = historico ?? [];

  return (
    <div>
      <PageHeader title="Histórico" subtitle="Registro de alterações tarifárias" />

      <NewItemPanel label="Novo registro" accent="violet" action={criarHistoricoAlteracao}>
        <Field label="Data"><Input type="date" name="data" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
        <Field label="Código relacionado"><Input name="codigo" /></Field>
        <Field label="Descrição da alteração"><Textarea name="descricao_alteracao" rows={2} required /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="history" text="Nenhuma alteração registrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Código</Th>
                <Th>Alteração</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => (
                <tr key={h.id}>
                  <Td className="font-medium text-neutral-100">{h.data}</Td>
                  <Td>{h.codigo ?? "—"}</Td>
                  <Td>{h.descricao_alteracao}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
