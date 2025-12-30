import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { landingImages } from "./data";

const LandingCtaSection = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={landingImages.cta} alt="Start Journey" className="h-full w-full object-cover brightness-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full w-full max-w-[1600px] mx-auto px-6 md:px-[56px] flex flex-col justify-between py-20">
        <h2 className="max-w-2xl text-5xl font-medium tracking-[-0.03em] text-white md:text-[80px] leading-[1]">
          Comece sua jornada
        </h2>

        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <Link to="/login">
            <div className="group flex h-14 w-auto items-center gap-4 rounded-full bg-white pl-8 pr-2 transition-transform hover:scale-105 cursor-pointer">
              <span className="text-lg font-medium text-black">Começar Agora</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
          <p className="max-w-md text-right text-lg font-light text-white/80">
            Descubra como a AtmosAgro pode aumentar sua produtividade e otimizar seus recursos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaSection;
