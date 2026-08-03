"use client";

import { useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Button, Card } from "@/components/ui";

export function NewItemPanel({
  label,
  accent = "amber",
  action,
  children,
}: {
  label: string;
  accent?: string;
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="mb-6">
      {!open && (
        <Button accent={accent} onClick={() => setOpen(true)}>
          <Icon name="plus" size={16} />
          {label}
        </Button>
      )}

      {open && (
        <Card>
          <form
            ref={formRef}
            action={async (formData) => {
              await action(formData);
              formRef.current?.reset();
              setOpen(false);
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
            <div className="flex items-center gap-2">
              <Button type="submit" accent={accent}>
                Salvar
              </Button>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
