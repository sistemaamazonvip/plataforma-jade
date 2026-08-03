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

export async function criarReserva(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  await supabase.from("flutuante_reservas").insert({
    cliente_nome: str(formData, "cliente_nome"),
    contato: str(formData, "contato"),
    cabine: str(formData, "cabine"),
    checkin: str(formData, "checkin"),
    checkout: str(formData, "checkout"),
    valor: num(formData, "valor"),
    status: str(formData, "status") ?? "negociando",
    observacoes: str(formData, "observacoes"),
    created_by: userData.user?.id ?? null,
  });

  revalidatePath("/flutuante");
  revalidatePath("/flutuante/reservas");
}

export async function atualizarStatusReserva(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("flutuante_reservas").update({ status }).eq("id", id);
  revalidatePath("/flutuante");
  revalidatePath("/flutuante/reservas");
}

export async function criarTarefa(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_tarefas").insert({
    titulo: str(formData, "titulo"),
    descricao: str(formData, "descricao"),
    responsavel: str(formData, "responsavel"),
    status: str(formData, "status") ?? "pendente",
    prazo: str(formData, "prazo"),
  });
  revalidatePath("/flutuante/tarefas");
}

export async function atualizarStatusTarefa(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("flutuante_tarefas").update({ status }).eq("id", id);
  revalidatePath("/flutuante/tarefas");
}

export async function criarCliente(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_clientes").insert({
    nome: str(formData, "nome"),
    telefone: str(formData, "telefone"),
    email: str(formData, "email"),
    observacoes: str(formData, "observacoes"),
  });
  revalidatePath("/flutuante/clientes");
}

export async function criarParceiro(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_parceiros").insert({
    nome: str(formData, "nome"),
    tipo: str(formData, "tipo"),
    contato: str(formData, "contato"),
    observacoes: str(formData, "observacoes"),
  });
  revalidatePath("/flutuante/parceiros");
}

export async function criarLancamento(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_financeiro").insert({
    descricao: str(formData, "descricao"),
    tipo: str(formData, "tipo") ?? "entrada",
    categoria: str(formData, "categoria"),
    valor: num(formData, "valor"),
    data: str(formData, "data"),
    status: str(formData, "status") ?? "pendente",
  });
  revalidatePath("/flutuante");
  revalidatePath("/flutuante/financeiro");
}

export async function criarItemInventario(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_inventario").insert({
    item: str(formData, "item"),
    categoria: str(formData, "categoria"),
    quantidade: num(formData, "quantidade"),
    unidade: str(formData, "unidade") ?? "un",
    minimo: num(formData, "minimo"),
  });
  revalidatePath("/flutuante/inventario");
}

export async function criarPreco(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("flutuante_precos").insert({
    item: str(formData, "item"),
    descricao: str(formData, "descricao"),
    valor: num(formData, "valor"),
    ativo: true,
  });
  revalidatePath("/flutuante/precos");
}
