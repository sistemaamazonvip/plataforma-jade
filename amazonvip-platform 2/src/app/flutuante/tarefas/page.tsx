import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarTarefa, atualizarStatusTarefa } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

export default async function TarefasPage() {
  const supabase = await createClient();
  const { data: tarefas } = await supabase
    .from("flutuante_tarefas")
    .select("*")
    .order("prazo", { ascending: true, nullsFirst: false });

  return (
    <div>
      <PageHeader title="Tarefas" subtitle="Manutenção, abastecimento e escala da equipe" />

      <NewItemPanel label="Nova tarefa" action={criarTarefa}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Responsável"><Input name="responsavel" /></Field>
        <Field label="Prazo"><Input type="date" name="prazo" /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {!tarefas || tarefas.length === 0 ? (
          <EmptyState icon="tasks" text="Nenhuma tarefa cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Responsável</Th>
                <Th>Prazo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {tarefas.map((t) => (
                <tr key={t.id}>
                  <Td>
                    <div className="font-medium text-neutral-100">{t.titulo}</div>
                    {t.descricao && <div className="text-xs text-neutral-500">{t.descricao}</div>}
                  </Td>
                  <Td>{t.responsavel ?? "—"}</Td>
                  <Td>{t.prazo ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={t.id} status={t.status} options={STATUS_OPTIONS} onChange={atualizarStatusTarefa} />
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
