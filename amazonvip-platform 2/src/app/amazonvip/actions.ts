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

export async function criarVenda(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("amazonvip_vendas").insert({
    cliente: str(formData, "cliente"),
    produto: str(formData, "produto"),
    valor: num(formData, "valor"),
    vendedor: str(formData, "vendedor"),
    data: str(formData, "data"),
    status: str(formData, "status") ?? "confirmada",
  });
  revalidatePath("/amazonvip");
  revalidatePath("/amazonvip/vendas");
}

export async function criarClienteAmazonVip(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("amazonvip_clientes").insert({
    nome: str(formData, "nome"),
    telefone: str(formData, "telefone"),
    email: str(formData, "email"),
    origem: str(formData, "origem"),
    status: str(formData, "status") ?? "lead",
  });
  revalidatePath("/amazonvip/clientes");
}

export async function atualizarStatusClienteAmazonVip(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("amazonvip_clientes").update({ status }).eq("id", id);
  revalidatePath("/amazonvip/clientes");
}

export async function criarMeta(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("amazonvip_metas").insert({
    vendedor: str(formData, "vendedor"),
    mes: str(formData, "mes"),
    meta_valor: num(formData, "meta_valor"),
  });
  revalidatePath("/amazonvip/metas");
}

export async function criarComissao(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("amazonvip_comissoes").insert({
    produto: str(formData, "produto"),
    percentual: num(formData, "percentual"),
    ativo: str(formData, "ativo") !== "false",
  });
  revalidatePath("/amazonvip/comissoes");
}
