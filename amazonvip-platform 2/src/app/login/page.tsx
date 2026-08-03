import { login } from "./actions";
import { Icon } from "@/components/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <Icon name="building" size={26} className="text-neutral-950" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-100">AmazonVip</h1>
          <p className="text-sm text-neutral-500 mt-1">Plataforma interna</p>
        </div>

        <form
          action={login}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-neutral-400">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@amazonvipviagensturismo.com.br"
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-neutral-400">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          {erro && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
              <Icon name="alert" size={14} />
              {erro === "conta-inativa" ? "Sua conta está inativa. Fale com o administrador." : erro}
            </div>
          )}

          <button
            type="submit"
            className="mt-1 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-semibold text-sm rounded-lg py-2.5 hover:brightness-110 transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-neutral-600 mt-6">
          Acesso restrito a colaboradores da Amazon Vip.
          <br />
          Sua conta é criada pelo administrador da plataforma.
        </p>
      </div>
    </div>
  );
}
