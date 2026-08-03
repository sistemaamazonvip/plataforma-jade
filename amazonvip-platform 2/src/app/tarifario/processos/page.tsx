import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarProcesso, atualizarStatusProcesso } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

export default async function ProcessosPage() {
  const supabase = await createClient();
  const { data: processos } = await supabase
    .from("tarifario_processos")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = processos ?? [];

  return (
    <div>
      <PageHeader title="Processos" subtitle="Passo a passo de revisão tarifária" />

      <NewItemPanel label="Novo processo" accent="violet" action={criarProcesso}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Responsável"><Input name="responsavel" /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="flow" text="Nenhum processo cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Responsável</Th>
                <Th>Descrição</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium text-neutral-100">{p.titulo}</Td>
                  <Td>{p.responsavel ?? "—"}</Td>
                  <Td>{p.descricao ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={p.id} status={p.status} options={STATUS_OPTIONS} onChange={atualizarStatusProcesso} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
