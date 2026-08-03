import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarCampanha } from "../actions";

export default async function CampanhasPage() {
  const supabase = await createClient();
  const { data: campanhas } = await supabase
    .from("marketing_campanhas")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = campanhas ?? [];

  return (
    <div>
      <PageHeader title="Campanhas" subtitle="Planejamento e acompanhamento de campanhas" />

      <NewItemPanel label="Nova campanha" accent="fuchsia" action={criarCampanha}>
        <Field label="Título"><Input name="titulo" required /></Field>
        <Field label="Canal"><Input name="canal" placeholder="Instagram, WhatsApp, Google..." /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="planejada">
            <option value="planejada">Planejada</option>
            <option value="ativa">Ativa</option>
            <option value="pausada">Pausada</option>
            <option value="concluida">Concluída</option>
          </Select>
        </Field>
        <Field label="Orçamento (R$)"><Input type="number" step="0.01" name="orcamento" /></Field>
        <Field label="Início"><Input type="date" name="data_inicio" /></Field>
        <Field label="Fim"><Input type="date" name="data_fim" /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="megaphone" text="Nenhuma campanha cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>Canal</Th>
                <Th>Período</Th>
                <Th>Orçamento</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.titulo}</Td>
                  <Td>{c.canal ?? "—"}</Td>
                  <Td>{c.data_inicio ?? "—"} → {c.data_fim ?? "—"}</Td>
                  <Td>{Number(c.orcamento ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Td>
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
