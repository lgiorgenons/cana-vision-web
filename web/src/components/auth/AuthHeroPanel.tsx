import type { ReactNode } from "react";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";

type AuthHeroPanelProps = {
  title: ReactNode;
  description: ReactNode;
  imageAlt: string;
};

const AuthHeroPanel = ({ title, description, imageAlt }: AuthHeroPanelProps) => {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img src={heroImage} alt={imageAlt} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

      <div className="absolute left-3 top-3 flex items-center gap-0 text-white">
        <img src={brandLogo} alt="AtmosAgro" className="h-20 w-20" />
        <span className="text-[20px] font-normal">AtmosAgro</span>
      </div>

      <div className="absolute bottom-12 left-8 right-10 text-white">
        <h2 className="max-w-xl text-5xl font-semibold leading-[50px]">{title}</h2>
        <p className="mt-6 max-w-xl text-base font-normal text-white/85 leading-[20px]">{description}</p>
      </div>
    </div>
  );
};

export default AuthHeroPanel;
