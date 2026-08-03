import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarPostCalendario, atualizarStatusPost } from "../actions";

const STATUS_OPTIONS = [
  { value: "planejado", label: "Planejado" },
  { value: "publicado", label: "Publicado" },
];

export default async function CalendarioPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("marketing_calendario")
    .select("*")
    .order("data", { ascending: true });
  const rows = posts ?? [];

  return (
    <div>
      <PageHeader title="Calendário Editorial" subtitle="Planejamento de posts e conteúdo" />

      <NewItemPanel label="Novo post" accent="fuchsia" action={criarPostCalendario}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Canal"><Input name="canal" placeholder="Instagram, Blog..." /></Field>
        <Field label="Data"><Input type="date" name="data" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="planejado">
            <option value="planejado">Planejado</option>
            <option value="publicado">Publicado</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="calendar" text="Nenhum post cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Título</Th>
                <Th>Canal</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <Td>{p.data}</Td>
                  <Td className="font-medium text-neutral-100">{p.titulo}</Td>
                  <Td>{p.canal ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={p.id} status={p.status} options={STATUS_OPTIONS} onChange={atualizarStatusPost} />
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
