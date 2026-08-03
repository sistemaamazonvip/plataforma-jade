import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input, Select, Textarea } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarReserva, atualizarStatusReserva } from "../actions";

const STATUS_OPTIONS = [
  { value: "negociando", label: "Negociando" },
  { value: "confirmada", label: "Confirmada" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export default async function ReservasPage() {
  const supabase = await createClient();
  const { data: reservas } = await supabase
    .from("flutuante_reservas")
    .select("*")
    .order("checkin", { ascending: true });

  return (
    <div>
      <PageHeader title="Reservas" subtitle="Hospedagem flutuante — check-in e check-out" />

      <NewItemPanel label="Nova reserva" action={criarReserva}>
        <Field label="Cliente"><Input name="cliente_nome" required /></Field>
        <Field label="Contato"><Input name="contato" placeholder="WhatsApp / telefone" /></Field>
        <Field label="Cabine"><Input name="cabine" placeholder="Ex: Cabine 3" /></Field>
        <Field label="Status">
          <Select name="status" defaultValue="negociando">
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Check-in"><Input type="date" name="checkin" /></Field>
        <Field label="Check-out"><Input type="date" name="checkout" /></Field>
        <Field label="Valor (R$)"><Input type="number" step="0.01" name="valor" /></Field>
        <Field label="Observações"><Textarea name="observacoes" rows={2} /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {!reservas || reservas.length === 0 ? (
          <EmptyState icon="calendar" text="Nenhuma reserva cadastrada ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Cabine</Th>
                <Th>Check-in</Th>
                <Th>Check-out</Th>
                <Th>Valor</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <Td>
                    <div className="font-medium text-neutral-100">{r.cliente_nome}</div>
                    {r.contato && <div className="text-xs text-neutral-500">{r.contato}</div>}
                  </Td>
                  <Td>{r.cabine ?? "—"}</Td>
                  <Td>{r.checkin ?? "—"}</Td>
                  <Td>{r.checkout ?? "—"}</Td>
                  <Td>{Number(r.valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Td>
                  <Td>
                    <StatusSelect id={r.id} status={r.status} options={STATUS_OPTIONS} onChange={atualizarStatusReserva} />
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
