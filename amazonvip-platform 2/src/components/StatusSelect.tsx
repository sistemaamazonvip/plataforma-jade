"use client";

import { useState, useTransition } from "react";

export function StatusSelect({
  id,
  status,
  options,
  onChange,
}: {
  id: string;
  status: string;
  options: { value: string; label: string }[];
  onChange: (id: string, status: string) => Promise<void>;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(async () => {
          await onChange(id, next);
        });
      }}
      className="bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-200 outline-none focus:border-amber-500/60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
