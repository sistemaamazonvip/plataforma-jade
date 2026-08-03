import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarCliente } from "../actions";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("flutuante_clientes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Clientes" subtitle="Cadastro de clientes do Flutuante" />

      <NewItemPanel label="Novo cliente" action={criarCliente}>
        <Field label="Nome"><Input name="nome" required /></Field>
        <Field label="Telefone"><Input name="telefone" /></Field>
        <Field label="E-mail"><Input type="email" name="email" /></Field>
        <Field label="Observações"><Textarea name="observacoes" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {!clientes || clientes.length === 0 ? (
          <EmptyState icon="users" text="Nenhum cliente cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Telefone</Th>
                <Th>E-mail</Th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.nome}</Td>
                  <Td>{c.telefone ?? "—"}</Td>
                  <Td>{c.email ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
