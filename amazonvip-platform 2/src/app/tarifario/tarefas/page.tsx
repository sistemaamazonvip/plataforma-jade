import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarTarefaTarifaria, atualizarStatusTarefaTarifaria } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
];

export default async function TarefasTarifarioPage() {
  const supabase = await createClient();
  const { data: tarefas } = await supabase
    .from("tarifario_tarefas")
    .select("*")
    .order("prazo", { ascending: true, nullsFirst: false });
  const rows = tarefas ?? [];

  return (
    <div>
      <PageHeader title="Tarefas" subtitle="Processos e revisões do código tarifário" />

      <NewItemPanel label="Nova tarefa" accent="violet" action={criarTarefaTarifaria}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Prazo"><Input type="date" name="prazo" /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="tag" text="Nenhuma tarefa cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Prazo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <Td>
                    <div className="font-medium text-neutral-100">{t.titulo}</div>
                    {t.descricao && <div className="text-xs text-neutral-500">{t.descricao}</div>}
                  </Td>
                  <Td>{t.prazo ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={t.id} status={t.status} options={STATUS_OPTIONS} onChange={atualizarStatusTarefaTarifaria} />
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
