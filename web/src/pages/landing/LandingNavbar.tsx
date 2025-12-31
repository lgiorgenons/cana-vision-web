import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { landingImages, navLinks } from "./data";

type LandingNavbarProps = {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

const LandingNavbar = ({ isScrolled, isMenuOpen, setIsMenuOpen, onNavigate }: LandingNavbarProps) => {
  const handleMobileLinkClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    onNavigate(event, sectionId);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? "bg-black py-4 shadow-md backdrop-blur-md" : "bg-transparent py-6"
        }`}
    >
      <div className="w-full max-w-[1600px] relative flex items-center justify-between px-6 md:px-[56px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={landingImages.logoWhite} alt="AtmosAgro" className="h-8" />
        </div>

        {/* Center Links (Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(event) => onNavigate(event, link.id)}
              className="text-[16px] font-normal text-white transition hover:text-landing-brand cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link to="/login" className="hidden text-sm font-medium text-white transition hover:text-landing-brand lg:block">
            Entrar
          </Link>
          <Link to="/registrar">
            <Button className="h-10 rounded-full bg-landing-brand px-6 text-sm font-medium text-white hover:bg-landing-brand-dark">
              Começar Agora
            </Button>
          </Link>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-white/10 [&_svg]:size-6 [&_svg]:w-6 [&_svg]:h-6"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-landing-ink border-l border-white/10">
                <div className="flex flex-col gap-6 pt-10">
                  {navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(event) => handleMobileLinkClick(event, link.id)}
                      className="text-lg font-normal text-white hover:text-landing-brand cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                  <hr className="border-white/10" />
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-normal text-white hover:text-landing-brand">
                    Entrar
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
