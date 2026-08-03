import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarCurso } from "../actions";

export default async function CursosPage() {
  const supabase = await createClient();
  const { data: cursos } = await supabase.from("ensino_cursos").select("*").order("created_at", { ascending: false });
  const rows = cursos ?? [];

  return (
    <div>
      <PageHeader title="Cursos" subtitle="Catálogo de cursos internos" />

      <NewItemPanel label="Novo curso" accent="sky" action={criarCurso}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Carga horária (h)"><Input type="number" name="carga_horaria" /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="ativo">
            <option value="planejado">Planejado</option>
            <option value="ativo">Ativo</option>
            <option value="encerrado">Encerrado</option>
          </Select>
        </Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="cap" text="Nenhum curso cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Carga horária</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td>
                    <div className="font-medium text-neutral-100">{c.titulo}</div>
                    {c.descricao && <div className="text-xs text-neutral-500">{c.descricao}</div>}
                  </Td>
                  <Td>{c.carga_horaria ? `${c.carga_horaria}h` : "—"}</Td>
                  <Td><StatusBadge status={c.status} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
