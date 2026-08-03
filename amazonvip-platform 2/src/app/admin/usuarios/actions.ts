"use server";

import { requireRole } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { ALL_ROLES, type Role } from "@/lib/config/sectors";
import { revalidatePath } from "next/cache";

export interface CriarFuncionarioResult {
  ok: boolean;
  message: string;
}

export async function criarFuncionario(formData: FormData): Promise<CriarFuncionarioResult> {
  await requireRole(["admin"]); // só admin pode criar contas

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!fullName || !email || !password || !role) {
    return { ok: false, message: "Preencha todos os campos." };
  }
  if (password.length < 8) {
    return { ok: false, message: "A senha deve ter pelo menos 8 caracteres." };
  }
  if (!ALL_ROLES.includes(role)) {
    return { ok: false, message: "Cargo inválido." };
  }

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    return { ok: false, message: createError?.message ?? "Não foi possível criar a conta." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    email,
    role,
    active: true,
  });

  if (profileError) {
    return { ok: false, message: `Conta criada, mas houve um erro ao salvar o perfil: ${profileError.message}` };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true, message: `Conta de ${fullName} criada com sucesso.` };
}

export async function alternarAtivo(id: string, active: boolean) {
  await requireRole(["admin"]);
  const supabase = await createClient();
  await supabase.from("profiles").update({ active }).eq("id", id);
  revalidatePath("/admin/usuarios");
}

export async function alterarCargo(id: string, role: Role) {
  await requireRole(["admin"]);
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/usuarios");
}
