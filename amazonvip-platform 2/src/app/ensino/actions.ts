"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}
function num(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

export async function criarCurso(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("ensino_cursos").insert({
    titulo: str(formData, "titulo"),
    descricao: str(formData, "descricao"),
    carga_horaria: num(formData, "carga_horaria"),
    status: str(formData, "status") ?? "ativo",
  });
  revalidatePath("/ensino");
  revalidatePath("/ensino/cursos");
}

export async function criarTurma(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("ensino_turmas").insert({
    curso_titulo: str(formData, "curso_titulo"),
    data_inicio: str(formData, "data_inicio"),
    data_fim: str(formData, "data_fim"),
    vagas: num(formData, "vagas") ?? 0,
    inscritos: num(formData, "inscritos") ?? 0,
    status: str(formData, "status") ?? "planejada",
  });
  revalidatePath("/ensino/turmas");
}

export async function criarMaterial(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("ensino_materiais").insert({
    titulo: str(formData, "titulo"),
    tipo: str(formData, "tipo") ?? "apostila",
    curso_titulo: str(formData, "curso_titulo"),
    link: str(formData, "link"),
  });
  revalidatePath("/ensino/materiais");
}

export async function criarCertificado(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("ensino_certificados").insert({
    aluno_nome: str(formData, "aluno_nome"),
    curso_titulo: str(formData, "curso_titulo"),
    data_emissao: str(formData, "data_emissao"),
    status: str(formData, "status") ?? "pendente",
  });
  revalidatePath("/ensino/certificados");
}

export async function atualizarStatusCertificado(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("ensino_certificados").update({ status }).eq("id", id);
  revalidatePath("/ensino/certificados");
}
