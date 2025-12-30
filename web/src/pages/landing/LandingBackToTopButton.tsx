import { ChevronsUp } from "lucide-react";

type LandingBackToTopButtonProps = {
  isScrolled: boolean;
  isMenuOpen: boolean;
};

const LandingBackToTopButton = ({ isScrolled, isMenuOpen }: LandingBackToTopButtonProps) => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9999, display: isMenuOpen ? "none" : "flex" }}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-landing-brand text-white shadow-lg transition-all duration-300 hover:bg-landing-brand-dark hover:scale-110 hover:shadow-xl ${isScrolled ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
    >
      <ChevronsUp className="h-8 w-8" />
    </button>
  );
};

export default LandingBackToTopButton;
