import { howItWorksSteps } from "./data";

const LandingTechnologySection = () => {
  return (
    <section id="technology" className="relative overflow-hidden bg-landing-ink pt-16 pb-16 text-white scroll-mt-48">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-landing-ink-forest via-landing-ink to-landing-ink-deep" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-landing-brand/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-landing-brand/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--landing-brand)_/_0.18),_transparent_45%)]" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-[56px] relative z-10">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-normal text-white tracking-[-0.03em] leading-[110%] md:text-5xl">
            Como funciona a <br />
            inteligência AtmosAgro?
          </h2>
          <p className="mt-4 text-[20px] font-normal text-landing-text-muted leading-[140%] tracking-[-0.02em]">
            Da captura da imagem ao diagnóstico em campo, tudo acontece automaticamente.<br />
            Se a matemática explica o universo, ela também explica o que acontece na sua lavoura.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-0 right-0 md:top-[16.5px] lg:top-[21px] h-[3px] bg-white hidden md:block" />
          <div className="absolute right-0 md:top-[13px] lg:top-[17.5px] h-3 w-3 rotate-45 border-t-[3px] border-r-[3px] border-white hidden md:block" />
          <div className="relative z-10 grid gap-10 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col">
                <div className="flex items-center justify-center">
                  <div className="flex h-[45px] w-[45px] md:h-9 md:w-9 lg:h-[45px] lg:w-[45px] items-center justify-center rounded-full bg-landing-brand border-[2px] border-white text-[22px] md:text-[18px] lg:text-[22px] font-normal text-white leading-[150%] tracking-[-0.01em]">
                    {step.step}
                  </div>
                </div>

                <div className="mt-10 overflow-hidden rounded-[5px] border border-white/10 bg-black/60">
                  <div className="relative aspect-square">
                    <img src={step.image} alt={step.title} className="h-full w-full object-cover" />
                  </div>
                </div>

                <h3 className="mt-5 text-[24px] font-normal text-white leading-[140%] tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[16px] font-normal text-landing-text-muted leading-[150%] tracking-[-0.01em]">
                  {step.description}
                </p>
                <p className="mt-4 text-[16px] font-normal text-landing-text-muted leading-[150%] tracking-[-0.01em]">
                  <span className="font-semibold text-landing-brand">Resultado:</span> {step.result}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-20 text-[16px] font-normal leading-[140%] tracking-[-0.02em] text-center italic text-white/50">
          "A matemática é a linguagem com a qual Deus escreveu o universo." <br /> Galileu Galilei (1564-1642)
        </p>
      </div>
    </section>
  );
};

export default LandingTechnologySection;
