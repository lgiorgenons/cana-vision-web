import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingImages } from "./data";

type LandingHeroSectionProps = {
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

const LandingHeroSection = ({ onNavigate }: LandingHeroSectionProps) => {
  return (
    <section className="relative flex h-screen flex-col justify-center pt-32 pb-24 pl-4 pr-4 md:pl-20 md:pt-0">
      {/* Background Image (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <img
          src={landingImages.heroBackground}
          alt="Sugarcane Field Top View"
          className="h-full w-full object-cover brightness-[0.25]"
        />
      </div>

      {/* Content (Left Aligned, Bottom) */}
      <div className="relative pt-16 z-10 max-w-full text-center px-4">
        {/* Headline */}
        <h1 className="flex flex-col items-center gap-0 md:gap-2 lg:gap-0 text-4xl font-normal tracking-[-3px] text-white drop-shadow-lg md:text-[60px] lg:text-[72px] leading-[1.1] md:leading-[1.2]">
          <span>
            Detecte problemas na sua <span className="text-landing-brand drop-shadow-md">Lavoura</span>
          </span>
          <span>antes que apareçam</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-3xl text-[16px] md:text-[20px] tracking-[0px] text-slate-100 drop-shadow-md leading-[1.4] md:leading-[1.5] font-normal">
          Monitoramento via satélite com NDVI, NDRE e NDMI, gerando alertas automáticos baseados nos cálculos desses índices.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <div className="group flex h-12 w-auto items-center gap-4 rounded-full bg-landing-brand pl-8 pr-2 transition-transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-green-500/30">
              <span className="text-[16px] font-normal text-white">Começar Agora</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-landing-brand transition-transform group-hover:rotate-45">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-white bg-transparent px-8 text-[16px] font-normal text-white hover:bg-white hover:text-slate-900 transition-all"
          >
            Ver como funciona
          </Button>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <a
        href="#solutions"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white opacity-100 transition-opacity hover:opacity-60 md:flex"
        onClick={(event) => onNavigate(event, "solutions")}
      >
        <Mouse className="h-8 w-8 animate-bounce" />
        <span className="text-xs font-medium tracking-widest uppercase">Explore Mais</span>
      </a>
    </section>
  );
};

export default LandingHeroSection;
