import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarTarefaSkip, atualizarStatusTarefaSkip } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

export default async function TarefasSkipTravelPage() {
  const supabase = await createClient();
  const { data: tarefas } = await supabase
    .from("skiptravel_tarefas")
    .select("*")
    .order("prazo", { ascending: true });
  const rows = tarefas ?? [];

  return (
    <div>
      <PageHeader title="Tarefas" subtitle="Checklist operacional de embarque" />

      <NewItemPanel label="Nova tarefa" accent="cyan" action={criarTarefaSkip}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Prazo"><Input type="date" name="prazo" /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="tasks" text="Nenhuma tarefa cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Descrição</Th>
                <Th>Prazo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <Td className="font-medium text-neutral-100">{t.titulo}</Td>
                  <Td>{t.descricao ?? "—"}</Td>
                  <Td>{t.prazo ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={t.id} status={t.status} options={STATUS_OPTIONS} onChange={atualizarStatusTarefaSkip} />
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
