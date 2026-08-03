import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { Icon } from "@/components/icons";
import { criarItemInventario } from "../actions";

export default async function InventarioPage() {
  const supabase = await createClient();
  const { data: itens } = await supabase
    .from("flutuante_inventario")
    .select("*")
    .order("item", { ascending: true });

  const rows = itens ?? [];

  return (
    <div>
      <PageHeader title="Inventário" subtitle="Suprimentos e itens do Flutuante" />

      <NewItemPanel label="Novo item" action={criarItemInventario}>
        <Field label="Item"><Input name="item" required /></Field>
        <Field label="Categoria"><Input name="categoria" /></Field>
        <Field label="Quantidade"><Input type="number" name="quantidade" defaultValue={0} /></Field>
        <Field label="Unidade"><Input name="unidade" defaultValue="un" /></Field>
        <Field label="Estoque mínimo"><Input type="number" name="minimo" defaultValue={0} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="box" text="Nenhum item cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Categoria</Th>
                <Th>Quantidade</Th>
                <Th>Mínimo</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const baixo = i.quantidade <= (i.minimo ?? 0);
                return (
                  <tr key={i.id}>
                    <Td className="font-medium text-neutral-100">{i.item}</Td>
                    <Td>{i.categoria ?? "—"}</Td>
                    <Td>{i.quantidade} {i.unidade}</Td>
                    <Td>{i.minimo} {i.unidade}</Td>
                    <Td>
                      {baixo && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <Icon name="alert" size={13} /> Estoque baixo
                        </span>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
