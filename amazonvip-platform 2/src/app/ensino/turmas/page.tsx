import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarTurma } from "../actions";

export default async function TurmasPage() {
  const supabase = await createClient();
  const { data: turmas } = await supabase
    .from("ensino_turmas")
    .select("*")
    .order("data_inicio", { ascending: true, nullsFirst: false });
  const rows = turmas ?? [];

  return (
    <div>
      <PageHeader title="Turmas" subtitle="Gestão de turmas e matrículas" />

      <NewItemPanel label="Nova turma" accent="sky" action={criarTurma}>
        <Field label="Curso"><Input name="curso_titulo" required /></Field>
        <Field label="Vagas"><Input type="number" name="vagas" /></Field>
        <Field label="Inscritos"><Input type="number" name="inscritos" /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="planejada">
            <option value="planejada">Planejada</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </Select>
        </Field>
        <Field label="Início"><Input type="date" name="data_inicio" /></Field>
        <Field label="Fim"><Input type="date" name="data_fim" /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="users" text="Nenhuma turma cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Curso</Th>
                <Th>Período</Th>
                <Th>Vagas</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <Td className="font-medium text-neutral-100">{t.curso_titulo}</Td>
                  <Td>{t.data_inicio ?? "—"} → {t.data_fim ?? "—"}</Td>
                  <Td>{t.inscritos}/{t.vagas}</Td>
                  <Td><StatusBadge status={t.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
