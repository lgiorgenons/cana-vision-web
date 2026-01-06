"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type LayoutProps = {
  title?: string;
  description?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  hideChrome?: boolean;
};

type NavItem = { icon: string; label: string; href: string };
type NavSection = { key: string; icon: string; label: string; items: { label: string; href: string }[] };

const mainNavItems: NavItem[] = [
  { icon: "/images/ic_dashboard.svg", label: "Dashboard", href: "/dashboard" },
  { icon: "/images/ic_mapa_interativo.svg", label: "Mapa Interativo", href: "/mapa-interativo" },
];

const navSections: NavSection[] = [
  {
    key: "monitoramento",
    icon: "/images/ic_monitoramento.svg",
    label: "Monitoramento",
    items: [
      { label: "Analises", href: "/analises" },
      { label: "Relatorios", href: "/relatorios" },
    ],
  },
  {
    key: "propriedades",
    icon: "/images/ic_propriedades.svg",
    label: "Propriedades",
    items: [
      { label: "Nova Propriedade", href: "/propriedades/novo" },
      { label: "Talhoes", href: "/talhoes" },
    ],
  },
];

const trailingNavItems: NavItem[] = [{ icon: "/images/ic_dados_satelitais.svg", label: "Dados Satelitais", href: "/analises" }];

const collapsedNavItems: NavItem[] = [
  ...mainNavItems,
  ...navSections.map((section) => ({
    icon: section.icon,
    label: section.label,
    href: section.items[0]?.href ?? "/dashboard",
  })),
  ...trailingNavItems,
];

const utilityItems = [
  { icon: "/images/ic_documentacao.svg", label: "Documentacao" },
  { icon: "/images/ic_suporte.svg", label: "Suporte" },
  { icon: "/images/ic_configuracoes.svg", label: "Configuracoes" },
];

export const Layout = ({ title, description, headerActions, children, hideChrome }: LayoutProps) => {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    navSections.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.key] = true;
      return acc;
    }, {}),
  );

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const flatNavItems = useMemo(
    () => [
      ...mainNavItems,
      ...navSections.flatMap((section) => section.items.map((item) => ({ ...item, icon: section.icon }))),
      ...trailingNavItems,
    ],
    [],
  );

  const isActive = useCallback((href: string) => {
    if (pathname === href || pathname.startsWith(`${href}/`)) return true;
    if (href === "/mapa-interativo" && (pathname === "/hotspots" || pathname.startsWith("/hotspots/"))) {
      return true;
    }
    return false;
  }, [pathname]);

  const activeNavItem = useMemo(() => flatNavItems.find((item) => isActive(item.href)), [flatNavItems, isActive]);
  const pageTitle = title ?? activeNavItem?.label ?? "Dashboard";

  const renderToggleButton = (
    expanded: boolean,
    positionClass = "top-1/2 -translate-y-1/2",
    rightOffsetClass = "-right-[18px]",
  ) => (
    <button
      type="button"
      onClick={() => setIsSidebarExpanded(!expanded)}
      className={`absolute ${rightOffsetClass} flex h-8 w-8 items-center justify-center text-slate-500 transition hover:text-slate-900 focus-visible:outline-none ${positionClass}`}
      aria-label={expanded ? "Recolher menu" : "Expandir menu"}
    >
      <Image
        src="/images/ic_arrow_hide_menu.svg"
        alt=""
        width={24}
        height={24}
        className={`h-6 w-6 transition-transform ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );

  if (hideChrome) {
    return (
      <div className="flex min-h-screen bg-white text-slate-900">
        <main className="flex flex-1 flex-col bg-white px-4 py-4 md:px-6 md:py-6">
          <section className="flex-1">{children}</section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      {isSidebarExpanded ? (
        <aside className="relative flex w-72 flex-col border-r border-[#EAEEF4] bg-white px-5 py-6">
          <div className="flex items-center">
            <Image src="/images/ic_atmosAgro_full.svg" alt="AtmosAgro" width={140} height={40} className="h-10 w-auto" priority />
          </div>
          <div className="relative mt-5 flex w-full items-center justify-center py-3">
            <div className="h-[1px] w-full bg-[#CBCAD7]" />
            {renderToggleButton(true, "top-1/2 -translate-y-1/2", "-right-[36px]")}
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-2 font-semibold transition ${isActive(item.href) ? "bg-[#121826] text-white" : "text-slate-500 hover:bg-[#F0F0F0] hover:text-slate-900"
                    }`}
                >
                  <Image src={item.icon} alt="" width={24} height={24} className={`h-6 w-6 transition ${isActive(item.href) ? "brightness-0 invert" : ""}`} />
                  {item.label}
                </Link>
              ))}
            </div>

            {navSections.map((section) => {
              const open = expandedSections[section.key];
              const hasActiveChild = section.items.some((item) => isActive(item.href));
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold transition ${hasActiveChild ? "text-slate-900" : "text-slate-600"
                      } hover:bg-[#F0F0F0] hover:text-slate-900`}
                    aria-expanded={open}
                  >
                    <span className="flex items-center gap-3">
                      <Image src={section.icon} alt="" width={24} height={24} className="h-6 w-6" />
                      {section.label}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`} />
                  </button>
                  {open && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 border-l border-slate-200 pl-4 text-slate-500">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`rounded-md px-2 py-1 text-sm transition hover:bg-[#F0F0F0] hover:text-slate-900 ${isActive(item.href) ? "bg-[#F0F0F0] text-slate-900" : ""
                            }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {trailingNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2 font-semibold transition ${isActive(item.href) ? "bg-[#121826] text-white" : "text-slate-600 hover:bg-[#F0F0F0] hover:text-slate-900"
                  }`}
              >
                <Image src={item.icon} alt="" width={24} height={24} className="h-6 w-6" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-2 text-sm font-medium">
            {utilityItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-500 transition hover:bg-[#F0F0F0] hover:text-slate-900"
              >
                <Image src={item.icon} alt="" width={24} height={24} className="h-6 w-6" />
                {item.label}
              </button>
            ))}

            <div className="flex items-center gap-2 rounded-[10px] bg-[#F0F0F0] p-[6px]">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-semibold transition ${themeMode === "light" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
              >
                <Image src="/images/ic_light.svg" alt="Tema claro" width={24} height={24} className="h-6 w-6" />
                Claro
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-semibold transition ${themeMode === "dark" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
              >
                <Image src="/images/ic_dark.svg" alt="Tema escuro" width={24} height={24} className="h-6 w-6" />
                Escuro
              </button>
            </div>
          </div>
        </aside>
      ) : (
        <aside className="relative flex w-[88px] flex-col items-center border-r border-[#EAEEF4] bg-white py-6">
          <div className="flex items-center justify-center">
            <Image src="/images/ic_atmos_agro_svg.svg" alt="AtmosAgro" width={40} height={40} className="h-10 w-10" />
          </div>
          <div className="relative mt-4 flex w-full items-center justify-center py-3">
            <div className="h-[1px] w-10 bg-[#CBCAD7]" />
            {renderToggleButton(false, "top-1/2 -translate-y-1/2")}
          </div>

          <nav className="mt-6 flex flex-col items-center gap-4">
            {collapsedNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors ${isActive(item.href) ? "bg-[#242B36] text-white" : "text-slate-400 hover:bg-[#F0F0F0] hover:text-slate-900"
                  }`}
                aria-label={item.label}
              >
                <Image src={item.icon} alt="" width={24} height={24} className={`h-6 w-6 transition ${isActive(item.href) ? "invert" : ""}`} />
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col items-center gap-2">
            {utilityItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#F0F0F0] hover:text-slate-900"
                aria-label={item.label}
              >
                <Image src={item.icon} alt="" width={24} height={24} className="h-6 w-6" />
              </button>
            ))}
            <div className="flex w-12 flex-col items-center gap-2 rounded-[10px] bg-[#F0F0F0] p-2 text-slate-500">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${themeMode === "light" ? "bg-white shadow-sm" : ""
                  }`}
                aria-label="Tema claro"
              >
                <Image src="/images/ic_light.svg" alt="Tema claro" width={24} height={24} className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${themeMode === "dark" ? "bg-white shadow-sm" : ""
                  }`}
                aria-label="Tema escuro"
              >
                <Image src="/images/ic_dark.svg" alt="Tema escuro" width={24} height={24} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <main className="flex flex-1 flex-col bg-white px-4 py-4 lg:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            {headerActions ? <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div> : null}
            <div className="flex items-center">
              <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0F0]" aria-label="Notificacoes">
                <Image src="/images/ic_notificacao.svg" alt="" width={24} height={24} className="h-6 w-6" />
              </button>
              <div className="mx-[15px] h-5 w-[1px] bg-[#CBCAD7]" />
              <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
                <Image src="/images/ic_perfil.svg" alt="Usuario" width={32} height={32} className="h-8 w-8 rounded-full" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Andrew Smith</p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" aria-hidden="true">
                  <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex-1 overflow-hidden">{children}</section>
      </main>
    </div>
  );
};
