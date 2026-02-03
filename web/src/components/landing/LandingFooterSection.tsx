import type { MouseEvent } from "react";
import type { FooterLink } from "./data";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { footerContactInfo, footerLearnMore, footerProducts, footerQuickLinks, landingImages } from "./data";

type LandingFooterSectionProps = {
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

type FooterLinkListProps = {
  items: readonly FooterLink[];
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  withPointer?: boolean;
};

const FooterLinkList = ({ items, onNavigate, withPointer }: FooterLinkListProps) => {
  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const handleClick = item.id && onNavigate ? (event: MouseEvent<HTMLAnchorElement>) => onNavigate(event, item.id!) : undefined;
        return (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={handleClick}
              className={`text-base text-landing-text-muted hover:text-white transition-colors${withPointer && item.id ? " cursor-pointer" : ""
                }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const LandingFooterSection = ({ onNavigate }: LandingFooterSectionProps) => {
  return (
    <footer id="about" className="relative bg-black pt-20 overflow-hidden scroll-mt-48">
      {/* Watermark (Behind everything) */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-64 md:bottom-[115px] select-none opacity-[0.05] w-full text-center z-0">
        <span className="text-[140px] md:text-[280px] lg:text-[min(23vw,400px)] font-bold text-white leading-none tracking-tighter whitespace-nowrap">
          AtmosAgro
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-[56px] flex flex-col">
        {/* 1. Links Section */}
        <div className="grid gap-12 md:grid-cols-4 lg:gap-20">
          <div>
            <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Links Rápidos</h4>
            <FooterLinkList items={footerQuickLinks} onNavigate={onNavigate} withPointer />
          </div>
          <div>
            <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Saiba Mais</h4>
            <FooterLinkList items={footerLearnMore} />
          </div>
          <div>
            <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Produtos</h4>
            <FooterLinkList items={footerProducts} />
          </div>
          <div>
            <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Newsletter</h4>
            <div className="flex flex-col gap-6">
              {/* Newsletter Form */}
              <div className="relative w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full h-14 bg-landing-ink-strong border border-white/20 rounded-full px-6 pr-32 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-black font-medium px-6 rounded-full hover:bg-gray-200 transition-colors">
                  Inscrever
                </button>
              </div>

              {/* Contact Info (Compact) */}
              <ul className="space-y-2">
                {footerContactInfo.map((item) => (
                  <li key={item} className="text-base text-landing-text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Logo Section (Left Aligned on Desktop, Centered on Mobile) */}
        <div className="py-20 flex justify-center md:justify-start items-center">
          <img src={landingImages.logoWhite} alt="AtmosAgro" className="h-24 md:h-32 lg:h-40 opacity-100" />
        </div>
      </div>

      {/* 3. Bottom Bar (Full Width Background) */}
      <div className="w-full border-t border-white/10 bg-black z-20 relative mt-8">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[56px] py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} AtmosAgro | Todos os direitos reservados
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black hover:border-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooterSection;
