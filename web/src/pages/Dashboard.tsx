import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { icon: "/images/ic_dashboard.svg", label: "Dashboard", to: "/analises" },
  { icon: "/images/ic_mapa_interativo.svg", label: "Mapa interativo", to: "/analises" },
  { icon: "/images/ic_monitoramento.svg", label: "Dashboard", to: "/dashboard", active: true },
  { icon: "/images/ic_dados_satelitais.svg", label: "Dados satelitais", to: "/talhoes" },
  { icon: "/images/ic_propriedades.svg", label: "Propriedades", to: "/propriedades" },
];

const utilityItems = [
  { icon: "/images/ic_documentacao.svg", label: "Documentação" },
  { icon: "/images/ic_suporte.svg", label: "Suporte" },
  { icon: "/images/ic_configuracoes.svg", label: "Configurações" },
];

const Dashboard = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <aside className="flex w-[88px] flex-col items-center border-r border-[#EAEEF4] bg-white py-6">
        <div className="flex items-center justify-center">
          <img src="/images/ic_atmos_agro_svg.svg" alt="AtmosAgro" className="h-10 w-10" />
        </div>
        <div className="mt-8 h-[1px] w-10 bg-[#CBCAD7]" />

        <nav className="mt-8 flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors ${
                item.active ? "bg-[#242B36] text-white" : "text-slate-400 hover:text-slate-900"
              }`}
              aria-label={item.label}
            >
              <img src={item.icon} alt="" className={`h-6 w-6 transition ${item.active ? "invert" : ""}`} />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2">
          {utilityItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:text-slate-900"
              aria-label={item.label}
            >
              <img src={item.icon} alt="" className="h-6 w-6" />
            </button>
          ))}
          <div className="flex w-12 flex-col items-center gap-2 rounded-[10px] bg-[#F0F0F0] p-2 text-slate-500">
            <button
              type="button"
              onClick={() => setThemeMode("light")}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
                themeMode === "light" ? "bg-white shadow-sm" : ""
              }`}
              aria-label="Tema claro"
            >
              <img src="/images/ic_light.svg" alt="Tema claro" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setThemeMode("dark")}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
                themeMode === "dark" ? "bg-white shadow-sm" : ""
              }`}
              aria-label="Tema escuro"
            >
              <img src="/images/ic_dark.svg" alt="Tema escuro" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col px-8 py-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Atmos Agro</p>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0F0]">
              <img src="/images/ic_notificacao.svg" alt="Notificações" className="h-6 w-6" />
            </button>
            <div className="mx-[15px] h-5 w-[1px] bg-[#CBCAD7]" />
            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
              <img src="/images/ic_perfil.svg" alt="Usuário" className="h-8 w-8 rounded-full" />
              <div className="text-left">
                <p className="text-sm font-semibold">Andrew Smith</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" aria-hidden="true">
                <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        <section className="mt-10 flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-400">Conteúdo principal será exibido aqui.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
