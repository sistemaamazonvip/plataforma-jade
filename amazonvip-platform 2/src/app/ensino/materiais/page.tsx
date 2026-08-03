import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarMaterial } from "../actions";

const TIPO_LABELS: Record<string, string> = {
  apostila: "Apostila",
  video: "Vídeo",
  link: "Link",
  outro: "Outro",
};

export default async function MateriaisPage() {
  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("ensino_materiais")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = materiais ?? [];

  return (
    <div>
      <PageHeader title="Materiais" subtitle="Apostilas e materiais didáticos" />

      <NewItemPanel label="Novo material" accent="sky" action={criarMaterial}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Curso relacionado"><Input name="curso_titulo" /></Field>
        <Field label="Tipo">
          <Select name="tipo" defaultValue="apostila">
            <option value="apostila">Apostila</option>
            <option value="video">Vídeo</option>
            <option value="link">Link</option>
            <option value="outro">Outro</option>
          </Select>
        </Field>
        <Field label="Link"><Input name="link" placeholder="https://..." /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="doc" text="Nenhum material cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Curso</Th>
                <Th>Tipo</Th>
                <Th>Link</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <Td className="font-medium text-neutral-100">{m.titulo}</Td>
                  <Td>{m.curso_titulo ?? "—"}</Td>
                  <Td>{TIPO_LABELS[m.tipo] ?? m.tipo}</Td>
                  <Td>
                    {m.link ? (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">
                        Abrir ↗
                      </a>
                    ) : (
                      "—"
                    )}
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
