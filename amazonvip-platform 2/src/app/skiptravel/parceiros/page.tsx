import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarParceiroSkip } from "../actions";

export default async function ParceirosSkipTravelPage() {
  const supabase = await createClient();
  const { data: parceiros } = await supabase
    .from("skiptravel_parceiros")
    .select("*")
    .order("nome", { ascending: true });
  const rows = parceiros ?? [];

  return (
    <div>
      <PageHeader title="Parceiros" subtitle="Fornecedores e parceiros cadastrados" />

      <NewItemPanel label="Novo parceiro" accent="cyan" action={criarParceiroSkip}>
        <Field label="Nome"><Input name="nome" required /></Field>
        <Field label="Tipo"><Input name="tipo" placeholder="Hotel, Transporte, Guia..." /></Field>
        <Field label="Contato"><Input name="contato" placeholder="Telefone ou e-mail" /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
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
              {rows.map((p) => (
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
