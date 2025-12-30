import { Link } from "react-router-dom";
import { ArrowRight, Building2, Check } from "lucide-react";
import { LockKeyIcon } from "@phosphor-icons/react";
import { enterprisePlanFeatures, starterPlanFeatures } from "./data";

type PlanFeaturesProps = {
  items: readonly string[];
  iconWrapperClassName: string;
  itemTextClassName: string;
  iconClassName?: string;
};

const PlanFeatures = ({ items, iconWrapperClassName, itemTextClassName, iconClassName }: PlanFeaturesProps) => {
  return (
    <div className="flex-1 space-y-5 mb-12">
      {items.map((feature) => (
        <div key={feature} className="flex items-center gap-3">
          <div className={iconWrapperClassName}>
            <Check className={`h-4 w-4${iconClassName ? ` ${iconClassName}` : ""}`} strokeWidth={3} />
          </div>
          <span className={itemTextClassName}>{feature}</span>
        </div>
      ))}
    </div>
  );
};

const LandingPricingSection = () => {
  return (
    <section id="plans" className="bg-gradient-to-b from-landing-ink to-landing-ink-strong pt-16 pb-16 text-white scroll-mt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[56px]">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-normal tracking-[-0.03em] md:text-5xl">
            Leve tecnologia de precisão para o campo
          </h2>
          <p className="mt-4 text-xl text-landing-text-muted max-w-2xl mx-auto">
            Monitoramento profissional acessível para todos os tamanhos de propriedade. Comece sem custos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">
          {/* Card 1: Produtor Inicial (Clean White) */}
          <div className="flex flex-col rounded-[5px] bg-white p-8 sm:p-10 text-slate-900 transition-transform hover:scale-[1.01]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 text-xs font-semibold tracking-widest uppercase text-slate-600 mb-6">
                  Limitado
                </span>
                <h3 className="text-4xl font-medium tracking-tight">Produtor Inicial</h3>
              </div>
            </div>

            <PlanFeatures
              items={starterPlanFeatures}
              iconWrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center rounded-[full] text-black"
              itemTextClassName="text-[17px] font-normal text-landing-text-subtle"
            />

            <div className="mt-auto border-t border-slate-100 pt-8 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold">R$ 0</span>
                <span className="text-sm text-slate-400 font-normal">/ mês</span>
              </div>
              <Link to="/login">
                <button className="flex h-12 items-center gap-3 rounded-full bg-landing-ink px-8 text-sm font-normal text-white transition-all hover:bg-black hover:scale-105">
                  Começar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Enterprise (Clean Dark + Lock Body Reveal) */}
          <div className="group relative flex flex-col rounded-[5px] bg-landing-ink border border-white/10 p-8 sm:p-10 text-white overflow-hidden transition-all hover:border-white/20">
            {/* HEADER: Always Visible */}
            <div className="relative z-30 mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-landing-brand mb-6">
                Em Breve
              </span>
              <h3 className="text-4xl font-normal tracking-tight">Enterprise</h3>
            </div>

            {/* BODY CONTAINER: Relative for overlay positioning */}
            <div className="relative flex-1 flex flex-col">
              {/* OVERLAY: Lock Icon (Covers Body, Fades on Hover) */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-landing-ink transition-all duration-500 group-hover:opacity-0 group-hover:pointer-events-none">
                <div className="mb-2 rounded-full bg-white/5 p-6 backdrop-blur-sm border border-white/10 shadow-2xl">
                  <LockKeyIcon size={28} color="white" weight="fill" />
                </div>
              </div>

              {/* CONTENT: Features (Invisible by default, clear on hover) */}
              <div className="flex flex-col h-full transition-all duration-500 group-hover:blur-0 blur-[3px] opacity-0 group-hover:opacity-100">
                <PlanFeatures
                  items={enterprisePlanFeatures}
                  iconWrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                  itemTextClassName="text-[17px] font-normal text-landing-text-muted"
                  iconClassName="text-white"
                />

                <div className="mt-auto border-t border-white/10 pt-8 flex items-center justify-between">
                  <div>
                    <span className="block text-2xl font-semibold">Sob Consulta</span>
                    <span className="text-sm text-gray-500 font-normal">/ personalizado</span>
                  </div>
                  <button
                    disabled
                    className="flex h-12 items-center gap-3 rounded-full bg-landing-brand/20 px-8 text-sm font-normal text-landing-brand cursor-not-allowed"
                  >
                    Aguarde
                    <Building2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Background gradient for depth */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-landing-brand/10 blur-[80px]" />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-300">
            * O plano gratuito é por tempo limitado para os primeiros usuários da plataforma.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPricingSection;
