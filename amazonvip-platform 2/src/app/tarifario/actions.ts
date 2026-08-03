"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}
function num(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? Number(v) : 0;
}

export async function criarTarefaTarifaria(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("tarifario_tarefas").insert({
    titulo: str(formData, "titulo"),
    descricao: str(formData, "descricao"),
    status: str(formData, "status") ?? "pendente",
    prazo: str(formData, "prazo"),
  });
  revalidatePath("/tarifario");
  revalidatePath("/tarifario/tarefas");
}

export async function atualizarStatusTarefaTarifaria(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("tarifario_tarefas").update({ status }).eq("id", id);
  revalidatePath("/tarifario/tarefas");
}

export async function criarProcesso(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("tarifario_processos").insert({
    titulo: str(formData, "titulo"),
    descricao: str(formData, "descricao"),
    status: str(formData, "status") ?? "pendente",
    responsavel: str(formData, "responsavel"),
  });
  revalidatePath("/tarifario/processos");
}

export async function atualizarStatusProcesso(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("tarifario_processos").update({ status }).eq("id", id);
  revalidatePath("/tarifario/processos");
}

export async function criarItemTabela(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("tarifario_tabela").insert({
    codigo: str(formData, "codigo"),
    descricao: str(formData, "descricao"),
    valor: num(formData, "valor"),
    ativo: str(formData, "ativo") !== "false",
  });
  revalidatePath("/tarifario/tabela");
}

export async function criarHistoricoAlteracao(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("tarifario_historico").insert({
    data: str(formData, "data"),
    codigo: str(formData, "codigo"),
    descricao_alteracao: str(formData, "descricao_alteracao"),
  });
  revalidatePath("/tarifario/historico");
}
