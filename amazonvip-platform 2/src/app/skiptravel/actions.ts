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

export async function criarInventarioViagem(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("skiptravel_inventario").insert({
    pacote: str(formData, "pacote"),
    data_saida: str(formData, "data_saida"),
    vagas_total: num(formData, "vagas_total"),
    vagas_disponiveis: num(formData, "vagas_disponiveis"),
    valor: num(formData, "valor"),
  });
  revalidatePath("/skiptravel");
  revalidatePath("/skiptravel/inventario");
}

export async function criarOperacao(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("skiptravel_operacoes").insert({
    pacote: str(formData, "pacote"),
    data_saida: str(formData, "data_saida"),
    responsavel: str(formData, "responsavel"),
    status: str(formData, "status") ?? "planejada",
  });
  revalidatePath("/skiptravel/operacoes");
}

export async function atualizarStatusOperacao(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("skiptravel_operacoes").update({ status }).eq("id", id);
  revalidatePath("/skiptravel/operacoes");
}

export async function criarParceiroSkip(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("skiptravel_parceiros").insert({
    nome: str(formData, "nome"),
    tipo: str(formData, "tipo"),
    contato: str(formData, "contato"),
  });
  revalidatePath("/skiptravel/parceiros");
}

export async function criarTarefaSkip(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("skiptravel_tarefas").insert({
    titulo: str(formData, "titulo"),
    descricao: str(formData, "descricao"),
    status: str(formData, "status") ?? "pendente",
    prazo: str(formData, "prazo"),
  });
  revalidatePath("/skiptravel/tarefas");
}

export async function atualizarStatusTarefaSkip(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("skiptravel_tarefas").update({ status }).eq("id", id);
  revalidatePath("/skiptravel/tarefas");
}
