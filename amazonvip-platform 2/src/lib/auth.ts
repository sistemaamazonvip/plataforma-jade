import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/config/sectors";

export interface CurrentProfile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  active: boolean;
}

/**
 * Data Access Layer: busca o perfil do usuário autenticado.
 * Memoizado por requisição via React `cache`.
 */
export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, active")
    .eq("id", userData.user.id)
    .single();

  if (!profile || profile.active === false) return null;
  return profile as CurrentProfile;
});

/** Garante que o usuário está logado e tem um dos roles permitidos; senão redireciona. */
export async function requireRole(allowed: Role[]): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  if (!allowed.includes(profile.role)) {
    redirect("/");
  }
  return profile;
}
