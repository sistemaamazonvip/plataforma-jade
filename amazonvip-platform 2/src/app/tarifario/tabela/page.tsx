import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, StatusBadge, Field, Input, Select } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { criarItemTabela } from "../actions";

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function TabelaTarifariaPage() {
  const supabase = await createClient();
  const { data: itens } = await supabase
    .from("tarifario_tabela")
    .select("*")
    .order("codigo", { ascending: true });
  const rows = itens ?? [];

  return (
    <div>
      <PageHeader title="Tabela Tarifária" subtitle="Classificação vigente por serviço" />

      <NewItemPanel label="Novo item" accent="violet" action={criarItemTabela}>
        <Field label="Código"><Input name="codigo" required /></Field>
        <Field label="Descrição"><Input name="descricao" /></Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" /></Field>
        <Field label="Ativo">
          <Select name="ativo" defaultValue="true">
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
        </Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="table" text="Nenhum item cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Código</Th>
                <Th>Descrição</Th>
                <Th>Valor</Th>
                <Th>Situação</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id}>
                  <Td className="font-medium text-neutral-100">{i.codigo}</Td>
                  <Td>{i.descricao ?? "—"}</Td>
                  <Td>{fmtBRL(Number(i.valor ?? 0))}</Td>
                  <Td><StatusBadge status={i.ativo ? "ativo" : "encerrado"} /></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
