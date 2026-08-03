import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarParceiro } from "../actions";

export default async function ParceirosPage() {
  const supabase = await createClient();
  const { data: parceiros } = await supabase
    .from("flutuante_parceiros")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Parceiros" subtitle="Fornecedores e parceiros do Flutuante" />

      <NewItemPanel label="Novo parceiro" action={criarParceiro}>
        <Field label="Nome"><Input name="nome" required /></Field>
        <Field label="Tipo"><Input name="tipo" placeholder="Ex: Fornecedor de alimentos" /></Field>
        <Field label="Contato"><Input name="contato" /></Field>
        <Field label="Observações"><Textarea name="observacoes" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {!parceiros || parceiros.length === 0 ? (
          <EmptyState icon="handshake" text="Nenhum parceiro cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>Contato</Th>
              </tr>
            </thead>
            <tbody>
              {parceiros.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium text-neutral-100">{p.nome}</Td>
                  <Td>{p.tipo ?? "—"}</Td>
                  <Td>{p.contato ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
