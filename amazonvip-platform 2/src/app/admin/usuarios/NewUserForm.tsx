"use client";

import { useActionState, useState } from "react";
import { criarFuncionario, type CriarFuncionarioResult } from "./actions";
import { Field, Input, Select, Button } from "@/components/ui";
import { Icon } from "@/components/icons";
import { SECTORS } from "@/lib/config/sectors";

const initialState: CriarFuncionarioResult = { ok: false, message: "" };

export function NewUserForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prev: CriarFuncionarioResult, formData: FormData) => {
      const result = await criarFuncionario(formData);
      return result;
    },
    initialState
  );

  return (
    <div className="mb-6">
      {!open && (
        <Button onClick={() => setOpen(true)}>
          <Icon name="plus" size={16} />
          Nova conta de funcionário
        </Button>
      )}

      {open && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
          <form action={formAction} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome completo">
                <Input name="full_name" required />
              </Field>
              <Field label="E-mail">
                <Input type="email" name="email" required />
              </Field>
              <Field label="Senha provisória">
                <Input type="password" name="password" minLength={8} required />
              </Field>
              <Field label="Cargo (setor)">
                <Select name="role" required defaultValue="">
                  <option value="" disabled>
                    Selecione...
                  </option>
                  <option value="admin">Administrador</option>
                  {SECTORS.map((s) => (
                    <option key={s.role} value={s.role}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {state.message && (
              <div
                className={`text-sm rounded-lg px-3 py-2 ${
                  state.ok
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                    : "bg-red-950/40 text-red-400 border border-red-900/50"
                }`}
              >
                {state.message}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Criando..." : "Criar conta"}
              </Button>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
