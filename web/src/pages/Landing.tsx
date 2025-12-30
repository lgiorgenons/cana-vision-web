import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import LandingBackToTopButton from "./landing/LandingBackToTopButton";
import LandingCtaSection from "./landing/LandingCtaSection";
import LandingFaqSection from "./landing/LandingFaqSection";
import LandingFooterSection from "./landing/LandingFooterSection";
import LandingHeroSection from "./landing/LandingHeroSection";
import LandingNavbar from "./landing/LandingNavbar";
import LandingPricingSection from "./landing/LandingPricingSection";
import LandingSolutionsSection from "./landing/LandingSolutionsSection";
import LandingTechnologySection from "./landing/LandingTechnologySection";

const Landing = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 50;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  return (
    <div
      className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500/30"
      style={{ fontFamily: "Geist Sans, sans-serif" }}
    >
      <LandingNavbar
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onNavigate={scrollToSection}
      />
      <LandingHeroSection onNavigate={scrollToSection} />
      <LandingSolutionsSection />
      <LandingTechnologySection />
      <LandingPricingSection />
      <LandingFaqSection openFaqIndex={openFaqIndex} onToggle={handleFaqToggle} />
      <LandingCtaSection />
      <LandingFooterSection onNavigate={scrollToSection} />
      <LandingBackToTopButton isMenuOpen={isMenuOpen} isScrolled={isScrolled} />
    </div>
  );
};

export default Landing;
