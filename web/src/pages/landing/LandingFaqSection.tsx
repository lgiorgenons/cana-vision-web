import { ArrowRight, Plus, X } from "lucide-react";
import { faqData } from "./data";

type LandingFaqSectionProps = {
  openFaqIndex: number | null;
  onToggle: (index: number) => void;
};

const LandingFaqSection = ({ openFaqIndex, onToggle }: LandingFaqSectionProps) => {
  return (
    <section id="faq" className="py-16 bg-gradient-to-b from-white to-landing-surface scroll-mt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[56px]">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tighter text-black mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            Entenda como a AtmosAgro transforma sua produção com tecnologia de ponta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: FAQ List (8 cols) */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div
                  key={item.question}
                  className="group rounded-[5px] bg-white p-8 transition-all duration-300 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer"
                  onClick={() => onToggle(index)}
                >
                  <div className="flex items-center justify-between gap-6">
                    <h3 className="text-xl font-medium text-landing-ink-strong tracking-tight pr-8">{item.question}</h3>
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${openFaqIndex === index ? "bg-landing-accent rotate-90" : "bg-landing-surface-soft group-hover:bg-landing-surface-strong"
                        }`}
                    >
                      {openFaqIndex === index ? (
                        <X className="h-6 w-6 text-white" />
                      ) : (
                        <Plus className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${openFaqIndex === index ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Card (4 cols) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 rounded-[5px] bg-landing-accent p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
              {/* Decorative Elements (Agro Theme) */}
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-black/5 blur-2xl"></div>

              <div className="relative z-10 flex flex-col items-center h-full justify-between min-h-[300px] text-center">
                <div>
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-[26px] font-normal leading-tight">Ainda possui dúvidas?</h3>
                  <p className="mb-8 text-white/80 text-normal text-[16px]  leading-relaxed">
                    Nossa equipe de especialistas está pronta para analisar a sua lavoura.
                  </p>
                </div>

                <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-landing-accent transition-all hover:bg-gray-50 hover:shadow-lg active:scale-95">
                  <span>Falar com a equipe</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFaqSection;
