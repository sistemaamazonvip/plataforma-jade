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

export async function criarCampanha(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("marketing_campanhas").insert({
    titulo: str(formData, "titulo"),
    canal: str(formData, "canal"),
    status: str(formData, "status") ?? "planejada",
    data_inicio: str(formData, "data_inicio"),
    data_fim: str(formData, "data_fim"),
    orcamento: num(formData, "orcamento"),
  });
  revalidatePath("/marketing");
  revalidatePath("/marketing/campanhas");
}

export async function criarPostCalendario(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("marketing_calendario").insert({
    data: str(formData, "data"),
    canal: str(formData, "canal"),
    titulo: str(formData, "titulo"),
    status: str(formData, "status") ?? "planejado",
  });
  revalidatePath("/marketing/calendario");
}

export async function atualizarStatusPost(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("marketing_calendario").update({ status }).eq("id", id);
  revalidatePath("/marketing/calendario");
}

export async function criarItemInventarioMarketing(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("marketing_inventario").insert({
    item: str(formData, "item"),
    categoria: str(formData, "categoria"),
    quantidade: num(formData, "quantidade"),
    minimo: num(formData, "minimo"),
  });
  revalidatePath("/marketing/inventario");
}

export async function criarSolicitacao(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("marketing_solicitacoes").insert({
    solicitante: str(formData, "solicitante"),
    item: str(formData, "item"),
    descricao: str(formData, "descricao"),
    status: str(formData, "status") ?? "pendente",
  });
  revalidatePath("/marketing/solicitacoes");
}

export async function atualizarStatusSolicitacao(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("marketing_solicitacoes").update({ status }).eq("id", id);
  revalidatePath("/marketing/solicitacoes");
}
