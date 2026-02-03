import { landingImages, solutionFeatures } from "./data";

const LandingSolutionsSection = () => {
  return (
    <section id="solutions" className="bg-white pt-16 pb-0 relative overflow-hidden scroll-mt-48">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-[56px] z-10 relative">
        <div className="mb-[70px] text-center">
          <h2 className="text-4xl font-medium text-slate-900 md:text-5xl tracking-[-0.03em]">
            O que o AtmosAgro faz por você?
          </h2>
          <p className="mt-4 text-[24px] leading-[120%] text-landing-text-subtle max-w-[700px] mx-auto tracking-[-0.03em]">
            Fornecemos <span className="text-landing-brand font-normal">monitoramento</span> contínuo que identifica pragas,
            doenças e falhas nutricionais antes que afetem sua produtividade.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row items-start justify-start gap-12 xl:gap-[40px] mb-0 relative z-20">
          {/* Left Features Grid */}
          <div className="flex-1 w-full pb-0 xl:pb-[120px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full">
              {solutionFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[5px] flex flex-col items-start gap-4 p-6 w-full min-h-[190px] h-full border-[2px] border-landing-border bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-landing-brand text-white shrink-0">
                    <img src={feature.icon} alt={feature.iconAlt} className="w-6 h-6" style={{ filter: "brightness(0)" }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black tracking-[-0.03em]">{feature.title}</h4>
                    <p className="mt-2 text-[14px] leading-[15px] text-landing-text-subtle">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Tablet Mockup */}
          <div className="w-full xl:w-1/2 flex justify-center xl:justify-end items-center">
            <div className="relative w-full max-w-md md:max-w-xl xl:max-w-[720px]">
              <img
                src={landingImages.tablet}
                alt="Tablet Dashboard"
                className="relative z-10 w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Terrain Image */}
      <div className="w-full -mt-[80px] z-0 relative pointer-events-none">
        <img
          src={landingImages.terrain}
          alt="Terreno"
          className="w-full object-cover min-h-[140px] max-h-[340px] object-top"
        />
      </div>
    </section>
  );
};

export default LandingSolutionsSection;
