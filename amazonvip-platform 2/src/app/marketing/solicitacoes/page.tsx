import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarSolicitacao, atualizarStatusSolicitacao } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "atendida", label: "Atendida" },
];

export default async function SolicitacoesPage() {
  const supabase = await createClient();
  const { data: solicitacoes } = await supabase
    .from("marketing_solicitacoes")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = solicitacoes ?? [];

  return (
    <div>
      <PageHeader title="Solicitações" subtitle="Pedidos de peças e materiais" />

      <NewItemPanel label="Nova solicitação" accent="fuchsia" action={criarSolicitacao}>
        <Field label="Solicitante"><Input name="solicitante" required /></Field>
        <Field label="Item"><Input name="item" required /></Field>
        <Field label="Descrição"><Textarea name="descricao" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="inbox" text="Nenhuma solicitação registrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Solicitante</Th>
                <Th>Item</Th>
                <Th>Descrição</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <Td className="font-medium text-neutral-100">{s.solicitante}</Td>
                  <Td>{s.item}</Td>
                  <Td>{s.descricao ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={s.id} status={s.status} options={STATUS_OPTIONS} onChange={atualizarStatusSolicitacao} />
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
