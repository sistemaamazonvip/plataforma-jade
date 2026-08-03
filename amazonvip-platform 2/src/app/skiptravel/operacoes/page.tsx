import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarOperacao, atualizarStatusOperacao } from "../actions";

const STATUS_OPTIONS = [
  { value: "planejada", label: "Planejada" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export default async function OperacoesPage() {
  const supabase = await createClient();
  const { data: operacoes } = await supabase
    .from("skiptravel_operacoes")
    .select("*")
    .order("data_saida", { ascending: true });
  const rows = operacoes ?? [];

  return (
    <div>
      <PageHeader title="Operações" subtitle="Calendário de saídas e operações" />

      <NewItemPanel label="Nova operação" accent="cyan" action={criarOperacao}>
        <Field label="Pacote"><Input name="pacote" required /></Field>
        <Field label="Data de saída"><Input type="date" name="data_saida" /></Field>
        <Field label="Responsável"><Input name="responsavel" /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="planejada">
            <option value="planejada">Planejada</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="route" text="Nenhuma operação cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Pacote</Th>
                <Th>Data de saída</Th>
                <Th>Responsável</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <Td className="font-medium text-neutral-100">{o.pacote}</Td>
                  <Td>{o.data_saida ?? "—"}</Td>
                  <Td>{o.responsavel ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={o.id} status={o.status} options={STATUS_OPTIONS} onChange={atualizarStatusOperacao} />
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
