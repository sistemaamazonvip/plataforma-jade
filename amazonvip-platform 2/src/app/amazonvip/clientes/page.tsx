import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarClienteAmazonVip, atualizarStatusClienteAmazonVip } from "../actions";

const STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "cliente", label: "Cliente" },
  { value: "inativo", label: "Inativo" },
];

export default async function ClientesAmazonVipPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("amazonvip_clientes")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = clientes ?? [];

  return (
    <div>
      <PageHeader title="Clientes" subtitle="Base de leads e clientes" />

      <NewItemPanel label="Novo cliente" accent="orange" action={criarClienteAmazonVip}>
        <Field label="Nome"><Input name="nome" required /></Field>
        <Field label="Telefone"><Input name="telefone" /></Field>
        <Field label="E-mail"><Input type="email" name="email" /></Field>
        <Field label="Origem"><Input name="origem" placeholder="Indicação, Instagram..." /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="lead">
            <option value="lead">Lead</option>
            <option value="cliente">Cliente</option>
            <option value="inativo">Inativo</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="users" text="Nenhum cliente cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Telefone</Th>
                <Th>E-mail</Th>
                <Th>Origem</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.nome}</Td>
                  <Td>{c.telefone ?? "—"}</Td>
                  <Td>{c.email ?? "—"}</Td>
                  <Td>{c.origem ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={c.id} status={c.status} options={STATUS_OPTIONS} onChange={atualizarStatusClienteAmazonVip} />
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
