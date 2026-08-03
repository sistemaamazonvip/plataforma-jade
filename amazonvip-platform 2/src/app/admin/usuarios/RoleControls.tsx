"use client";

import { useState, useTransition } from "react";
import { alterarCargo, alternarAtivo } from "./actions";
import { SECTORS } from "@/lib/config/sectors";
import type { Role } from "@/lib/config/sectors";

export function RoleSelect({ id, role }: { id: string; role: Role }) {
  const [value, setValue] = useState(role);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as Role;
        setValue(next);
        startTransition(async () => {
          await alterarCargo(id, next);
        });
      }}
      className="bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-200 outline-none focus:border-amber-500/60"
    >
      <option value="admin">Administrador</option>
      {SECTORS.map((s) => (
        <option key={s.role} value={s.role}>
          {s.name}
        </option>
      ))}
    </select>
  );
}

export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(async () => {
          await alternarAtivo(id, next);
        });
      }}
      className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${
        value
          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
          : "bg-neutral-700/40 text-neutral-400 hover:bg-neutral-700/60"
      }`}
    >
      {value ? "Ativo" : "Inativo"}
    </button>
  );
}
