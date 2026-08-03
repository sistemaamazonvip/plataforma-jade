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

export async function criarLancamentoGeral(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("financeiro_lancamentos").insert({
    descricao: str(formData, "descricao"),
    centro_custo: str(formData, "centro_custo"),
    banco: str(formData, "banco"),
    tipo: str(formData, "tipo") ?? "entrada",
    valor: num(formData, "valor"),
    data: str(formData, "data"),
  });
  revalidatePath("/financeiro");
  revalidatePath("/financeiro/lancamentos");
}

export async function criarCentroCusto(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("financeiro_centros_custo").insert({
    nome: str(formData, "nome"),
    descricao: str(formData, "descricao"),
    responsavel: str(formData, "responsavel"),
  });
  revalidatePath("/financeiro/centros-de-custo");
}

export async function criarConta(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("financeiro_contas").insert({
    banco: str(formData, "banco"),
    agencia: str(formData, "agencia"),
    conta: str(formData, "conta"),
    saldo_inicial: num(formData, "saldo_inicial"),
  });
  revalidatePath("/financeiro/contas");
}
