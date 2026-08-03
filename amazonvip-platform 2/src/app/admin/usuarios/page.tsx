import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Table, Th, Td, EmptyState } from "@/components/ui";
import { ROLE_LABELS } from "@/lib/config/sectors";
import { NewUserForm } from "./NewUserForm";
import { RoleSelect, ActiveToggle } from "./RoleControls";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = profiles ?? [];

  return (
    <div>
      <PageHeader
        title="Usuários"
        subtitle="Crie contas de colaboradores e defina o cargo de cada um"
      />

      <NewUserForm />

      <Card className="p-0">
        {rows.length === 0 ? (
          <EmptyState icon="users" text="Nenhum colaborador cadastrado ainda." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>E-mail</Th>
                <Th>Cargo</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium text-neutral-100">{p.full_name}</Td>
                  <Td>{p.email}</Td>
                  <Td>
                    <RoleSelect id={p.id} role={p.role} />
                  </Td>
                  <Td>
                    <ActiveToggle id={p.id} active={p.active} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <p className="text-xs text-neutral-600 mt-4">
        Cargos disponíveis: {Object.entries(ROLE_LABELS).map(([, label]) => label).join(", ")}.
      </p>
    </div>
  );
}
