import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState, Field, Input } from "@/components/ui";
import { NewItemPanel } from "@/components/NewItemPanel";
import { StatusSelect } from "@/components/StatusSelect";
import { criarCertificado, atualizarStatusCertificado } from "../actions";

const STATUS_OPTIONS = [
  { value: "pendente", label: "Pendente" },
  { value: "emitido", label: "Emitido" },
];

export default async function CertificadosPage() {
  const supabase = await createClient();
  const { data: certificados } = await supabase
    .from("ensino_certificados")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = certificados ?? [];

  return (
    <div>
      <PageHeader title="Certificados" subtitle="Emissão de certificados de conclusão" />

      <NewItemPanel label="Novo certificado" accent="sky" action={criarCertificado}>
        <Field label="Aluno"><Input name="aluno_nome" required /></Field>
        <Field label="Curso"><Input name="curso_titulo" required /></Field>
        <Field label="Data de emissão"><Input type="date" name="data_emissao" /></Field>
      </NewItemPanel>

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="check" text="Nenhum certificado cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Aluno</Th>
                <Th>Curso</Th>
                <Th>Emissão</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium text-neutral-100">{c.aluno_nome}</Td>
                  <Td>{c.curso_titulo}</Td>
                  <Td>{c.data_emissao ?? "—"}</Td>
                  <Td>
                    <StatusSelect id={c.id} status={c.status} options={STATUS_OPTIONS} onChange={atualizarStatusCertificado} />
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
