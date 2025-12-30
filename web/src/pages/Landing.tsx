import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronsUp,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Globe2,
  Leaf,
  Mouse,
  Scan,
  ShieldCheck,
  Zap,
  Map,
  Bell,
  TrendingUp,
  CloudRain,
  Bug,
  Smartphone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Plus,
  X,
  MessageCircle,
  Sprout,
  Building2,
  Check,
  Lock,
} from "lucide-react";
import { LockKey, LockKeyIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import imgCampoHero from "../assets/img_campo_hero.jpg";
import imgIpad from "../assets/img_ipad.png";
import imgTerreno from "../assets/img_terreno.png";
import imgHero from "../assets/img_hero.png";
import icGota from "../assets/ic_gota_agua.svg";
import icVisualizacao from "../assets/ic_visualizacao.svg";
import icPraga from "../assets/ic_praga.svg";
import icControle from "../assets/ic_controle_safra.svg";

// FAQ Data
const faqData = [
  {
    question: "O que é a Plataforma AtmosAgro?",
    answer: "A AtmosAgro é uma solução completa de agricultura de precisão que utiliza sensores IoT e inteligência artificial para monitorar sua lavoura em tempo real, otimizando o uso de recursos e aumentando a produtividade."
  },
  {
    question: "Como funciona o monitoramento em tempo real?",
    answer: "Nossos sensores coletam dados de umidade, temperatura, solo e clima a cada minuto. Essas informações são processadas e enviadas para o seu painel, permitindo decisões rápidas e baseadas em dados precisos."
  },
  {
    question: "A plataforma serve para pequenos produtores?",
    answer: "Sim! A AtmosAgro é escalável. Temos planos adaptados tanto para grandes latifúndios quanto para agricultura familiar, garantindo acesso à tecnologia de ponta para todos."
  },
  {
    question: "Preciso de internet na fazenda toda?",
    answer: "Não necessariamente. Nossos dispositivos utilizam tecnologia LoRaWAN de longo alcance, que permite a comunicação dos sensores mesmo em áreas com cobertura de internet limitada."
  },
  {
    question: "Qual o suporte oferecido?",
    answer: "Oferecemos suporte técnico especializado 24/7, além de acompanhamento agronômico para ajudar você a interpretar os dados e tomar as melhores decisões para sua safra."
  }
];

const Landing = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // Start with first open if desired, or null

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeAccordion, setActiveAccordion] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 50;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    scrollToSection(e, sectionId);
    setIsMenuOpen(false);
  };

  const accordionItems = [
    {
      title: "Mapeamento de Talhões",
      desc: "Importe seus mapas KML/Shapefile em segundos e visualize sua propriedade com precisão de centímetros.",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Monitoramento de Pragas",
      desc: "Identifique focos de Sphenophorus e Broca com nossa IA antes que eles se espalhem.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Análise Nutricional (NDRE)",
      desc: "Mapas de clorofila para aplicação de nitrogênio em taxa variável. Economize insumos.",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Relatórios Automáticos",
      desc: "Gere relatórios de conformidade e produtividade em PDF/Excel com um único clique.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Coleta de Imagens",
      desc: "Monitoramos sua lavoura continuamente por imagens de satélite, cobrindo toda a área.",
      result: "O sistema destaca apenas o que realmente precisa de atenção.",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop"
    },
    {
      step: "2",
      title: "Processamento",
      desc: "Analisamos as imagens com modelos matemáticos para identificar áreas que fogem do normal.",
      result: "O sistema destaca apenas o que realmente precisa de atenção.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop"
    },
    {
      step: "3",
      title: "Diagnóstico e ação.",
      desc: "As áreas com problema aparecem no mapa, prontas para vistoria e decisão.",
      result: "Você vai direto ao ponto certo, no momento certo.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500/30" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
      {/* Navbar (Sticky & Adaptive) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? "bg-black py-4 shadow-md backdrop-blur-md" : "bg-transparent py-6"
          }`}
      >
        <div className="w-full max-w-[1600px] relative flex items-center justify-between px-6 md:px-[56px]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/images/ic_atmosAgro_full_white.svg" alt="AtmosAgro" className="h-8" />
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} className="text-[16px] font-normal text-white transition hover:text-[#34A853] cursor-pointer">Soluções</a>
            <a href="#technology" onClick={(e) => scrollToSection(e, 'technology')} className="text-[16px] font-normal text-white transition hover:text-[#34A853] cursor-pointer">Tecnologia</a>
            <a href="#plans" onClick={(e) => scrollToSection(e, 'plans')} className="text-[16px] font-normal text-white transition hover:text-[#34A853] cursor-pointer">Planos</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-[16px] font-normal text-white transition hover:text-[#34A853] cursor-pointer">Dúvidas</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden text-sm font-medium text-white transition hover:text-[#34A853] lg:block">
              Entrar
            </Link>
            <Link to="/login">
              <Button className="h-10 rounded-full bg-[#34A853] px-6 text-sm font-medium text-white hover:bg-[#2E9648]">
                Começar Agora
              </Button>
            </Link>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10 [&_svg]:size-6 [&_svg]:w-6 [&_svg]:h-6">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0b0b0b] border-l border-white/10">
                  <div className="flex flex-col gap-6 pt-10">
                    <a href="#solutions" onClick={(e) => handleMobileLinkClick(e, 'solutions')} className="text-lg font-normal text-white hover:text-[#34A853] cursor-pointer">Soluções</a>
                    <a href="#technology" onClick={(e) => handleMobileLinkClick(e, 'technology')} className="text-lg font-normal text-white hover:text-[#34A853] cursor-pointer">Tecnologia</a>
                    <a href="#plans" onClick={(e) => handleMobileLinkClick(e, 'plans')} className="text-lg font-normal text-white hover:text-[#34A853] cursor-pointer">Planos</a>
                    <a href="#faq" onClick={(e) => handleMobileLinkClick(e, 'faq')} className="text-lg font-normal text-white hover:text-[#34A853] cursor-pointer">Dúvidas</a>
                    <hr className="border-white/10" />
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-normal text-white hover:text-[#34A853]">
                      Entrar
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex h-screen flex-col justify-center pt-32 pb-24 pl-4 pr-4 md:pl-20 md:pt-0">
        {/* Background Image (Full Screen) */}
        <div className="absolute inset-0 z-0">
          <img
            src={imgCampoHero}
            alt="Sugarcane Field Top View"
            className="h-full w-full object-cover brightness-[0.25]"
          />
        </div>

        {/* Content (Left Aligned, Bottom) */}
        <div className="relative pt-16 z-10 max-w-full text-center px-4">
          {/* Headline */}
          <h1 className="flex flex-col items-center gap-0 md:gap-2 lg:gap-0 text-4xl font-normal tracking-[-3px] text-white drop-shadow-lg md:text-[60px] lg:text-[72px] leading-[1.1] md:leading-[1.2]">
            <span>
              Detecte problemas na sua <span className="text-[#34A853] drop-shadow-md">Lavoura</span>
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
              <div className="group flex h-12 w-auto items-center gap-4 rounded-full bg-[#34A853] pl-8 pr-2 transition-transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-green-500/30">
                <span className="text-[16px] font-normal text-white">Começar Agora</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#34A853] transition-transform group-hover:rotate-45">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
            <Button variant="outline" size="lg" className="h-12 rounded-full border-white bg-transparent px-8 text-[16px] font-normal text-white hover:bg-white hover:text-slate-900 transition-all">
              Ver como funciona
            </Button>
          </div>

        </div>

        {/* Mouse Scroll Indicator */}
        <a
          href="#solutions"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white opacity-100 transition-opacity hover:opacity-60 md:flex"
          onClick={(e) => scrollToSection(e, 'solutions')}
        >
          <Mouse className="h-8 w-8 animate-bounce" />
          <span className="text-xs font-medium tracking-widest uppercase">Explore Mais</span>
        </a>
      </section>

      {/* Productivity Section (Grid + Tablet Showcase) */}
      <section id="solutions" className="bg-white pt-16 pb-0 relative overflow-hidden scroll-mt-48">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-[56px] z-10 relative">
          <div className="mb-[70px] text-center">
            <h2 className="text-4xl font-medium text-slate-900 md:text-5xl tracking-[-0.03em]">
              O que o AtmosAgro faz por você?
            </h2>
            <p className="mt-4 text-[24px] leading-[120%] text-[#494949] max-w-[700px] mx-auto tracking-[-0.03em]">
              Fornecemos <span className="text-[#34A853] font-normal">monitoramento</span> contínuo que identifica pragas,
              doenças e falhas nutricionais antes que afetem sua produtividade.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row items-start justify-start gap-12 xl:gap-[40px] mb-0 relative z-20">

            {/* Left Features Grid */}
            <div className="flex-1 w-full pb-0 xl:pb-[120px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full">
                {/* Item 1 */}
                <div className="rounded-[5px] flex flex-col items-start gap-4 p-6 w-full min-h-[190px] h-full border-[2px] border-[#E3E3E3] bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-[#34A853] text-white shrink-0">
                    <img src={icGota} alt="Gota" className="w-6 h-6" style={{ filter: 'brightness(0)' }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black tracking-[-0.03em]">Estresse Hídrico</h4>
                    <p className="mt-2 text-[14px] leading-[15px] text-[#494949]">
                      Identifique áreas com falta de água antes que afetem a produtividade.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="rounded-[5px] flex flex-col items-start gap-4 p-6 w-full min-h-[190px] h-full border-[2px] border-[#E3E3E3] bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-[#34A853] text-white shrink-0">
                    <img src={icVisualizacao} alt="Visualização" className="w-6 h-6" style={{ filter: 'brightness(0)' }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black tracking-[-0.03em]">Visualização simplificada</h4>
                    <p className="mt-2 text-[14px] leading-[15px] text-[#494949]">
                      Veja índices avançados (NDVI, NDRE, NDMI) em mapas claros e simplificados.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="rounded-[5px] flex flex-col items-start gap-4 p-6 w-full min-h-[190px] h-full border-[2px] border-[#E3E3E3] bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-[#34A853] text-white shrink-0">
                    <img src={icPraga} alt="Praga" className="w-6 h-6" style={{ filter: 'brightness(0)' }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black tracking-[-0.03em]">Detecção de Pragas</h4>
                    <p className="mt-2 text-[14px] leading-[15px] text-[#494949]">
                      Detecte focos iniciais e aplique defensivos apenas onde necessário.
                    </p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="rounded-[5px] flex flex-col items-start gap-4 p-6 w-full min-h-[190px] h-full border-[2px] border-[#E3E3E3] bg-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-[#34A853] text-white shrink-0">
                    <img src={icControle} alt="Controle" className="w-6 h-6" style={{ filter: 'brightness(0)' }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black tracking-[-0.03em]">Controle de Safra</h4>
                    <p className="mt-2 text-[14px] leading-[15px] text-[#494949]">
                      Acompanhe o histórico da safra com relatórios automáticos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tablet Mockup */}
            <div className="w-full xl:w-1/2 flex justify-center xl:justify-end items-center">
              <div className="relative w-full max-w-md md:max-w-xl xl:max-w-[720px]">
                <img src={imgIpad} alt="Tablet Dashboard" className="relative z-10 w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Terrain Image */}
        {/* Bottom Terrain Image */}
        <div className="w-full -mt-[80px] z-0 relative pointer-events-none">
          <img src={imgTerreno} alt="Terreno" className="w-full object-cover min-h-[140px] max-h-[340px] object-top" />
        </div>
      </section>

      {/* How it Works Section */}
      <section id="technology" className="relative overflow-hidden bg-[#0b0b0b] pt-16 pb-16 text-white scroll-mt-48">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#07110a] via-[#0b0b0b] to-[#070807]" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#34A853]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#34A853]/10 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,168,83,0.18),_transparent_45%)]" />
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-[56px] relative z-10">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-normal text-white tracking-[-0.03em] leading-[110%] md:text-5xl">
              Como funciona a <br />
              inteligência AtmosAgro?
            </h2>
            <p className="mt-4 text-[20px] font-normal text-[#A7A7A7] leading-[140%] tracking-[-0.02em]">
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
                    <div className="flex h-[45px] w-[45px] md:h-9 md:w-9 lg:h-[45px] lg:w-[45px] items-center justify-center rounded-full bg-[#34A853] border-[2px] border-white text-[22px] md:text-[18px] lg:text-[22px] font-normal text-white leading-[150%] tracking-[-0.01em]">
                      {step.step}
                    </div>
                  </div>

                  <div className="mt-10 overflow-hidden rounded-[5px] border border-white/10 bg-black/60">
                    <div className="relative aspect-square">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="mt-5 text-[24px] font-normal text-white leading-[140%] tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-2 text-[16px] font-normal text-[#A7A7A7] leading-[150%] tracking-[-0.01em]">{step.desc}</p>
                  <p className="mt-4 text-[16px] font-normal text-[#A7A7A7] leading-[150%] tracking-[-0.01em]">
                    <span className="font-semibold text-[#34A853]">Resultado:</span> {step.result}
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

      {/* Pricing Section (Free Focus + Coming Soon) */}
      <section id="plans" className="bg-gradient-to-b from-[#0b0b0b] to-[#111] pt-16 pb-16 text-white scroll-mt-48">
        <div className="mx-auto max-w-[1600px] px-6 md:px-[56px]">

          <div className="mb-16 text-center">
            <h2 className="text-4xl font-normal tracking-[-0.03em] md:text-5xl">
              Leve tecnologia de precisão para o campo
            </h2>
            <p className="mt-4 text-xl text-[#A7A7A7] max-w-2xl mx-auto">
              Monitoramento profissional acessível para todos os tamanhos de propriedade.
              Comece sem custos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">

            {/* Card 1: Produtor Inicial (Clean White) */}
            <div className="flex flex-col rounded-[5px] bg-white p-8 sm:p-10 text-slate-900 transition-transform hover:scale-[1.01]">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 text-xs font-semibold tracking-widest uppercase text-slate-600 mb-6">
                    Limitado
                  </span>
                  <h3 className="text-4xl font-medium tracking-tight">Produtor Inicial</h3>
                </div>
              </div>

              <div className="flex-1 space-y-5 mb-12">
                {[
                  "Segmentação de propriedades",
                  "Identificação de talhões",
                  "Histórico de 1 ano (Satélite)",
                  "Filtros de Estresse Hídrico",
                  "Detecção de Pragas",
                  "Exportação de relatórios"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[full] text-black">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <span className="text-[17px] font-normal text-[#494949]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-slate-100 pt-8 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">R$ 0</span>
                  <span className="text-sm text-slate-400 font-normal">/ mês</span>
                </div>
                <Link to="/login">
                  <button className="flex h-12 items-center gap-3 rounded-full bg-[#0b0b0b] px-8 text-sm font-normal text-white transition-all hover:bg-black hover:scale-105">
                    Começar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Card 2: Enterprise (Clean Dark + Lock Body Reveal) */}
            <div className="group relative flex flex-col rounded-[5px] bg-[#0b0b0b] border border-white/10 p-8 sm:p-10 text-white overflow-hidden transition-all hover:border-white/20">

              {/* HEADER: Always Visible */}
              <div className="relative z-30 mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-[#34A853] mb-6">
                  Em Breve
                </span>
                <h3 className="text-4xl font-normal tracking-tight">Enterprise</h3>
              </div>

              {/* BODY CONTAINER: Relative for overlay positioning */}
              <div className="relative flex-1 flex flex-col">

                {/* OVERLAY: Lock Icon (Covers Body, Fades on Hover) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0b0b0b] transition-all duration-500 group-hover:opacity-0 group-hover:pointer-events-none">
                  <div className="mb-2 rounded-full bg-white/5 p-6 backdrop-blur-sm border border-white/10 shadow-2xl">
                    <LockKeyIcon size={28} color="white" weight="fill" />
                  </div>
                </div>

                {/* CONTENT: Features (Invisible by default, clear on hover) */}
                <div className="flex flex-col h-full transition-all duration-500 group-hover:blur-0 blur-[3px] opacity-0 group-hover:opacity-100">
                  <div className="flex-1 space-y-5 mb-12">
                    {[
                      "Gestão de frota e maquinário",
                      "Integração via API e ERP",
                      "Relatórios preditivos (IA)",
                      "Suporte 24/7 dedicado",
                      "Múltiplos usuários e níveis",
                      "Consultoria agronômica"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-[17px] font-normal text-[#A7A7A7]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-8 flex items-center justify-between">
                    <div>
                      <span className="block text-2xl font-semibold">Sob Consulta</span>
                      <span className="text-sm text-gray-500 font-normal">/ personalizado</span>
                    </div>
                    <button disabled className="flex h-12 items-center gap-3 rounded-full bg-[#34A853]/20 px-8 text-sm font-normal text-[#34A853] cursor-not-allowed">
                      Aguarde
                      <Building2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Background gradient for depth */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[#34A853]/10 blur-[80px]" />
            </div>

          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-300">
              * O plano gratuito é por tempo limitado para os primeiros usuários da plataforma.
            </p>
          </div>

        </div>
      </section>

      {/* FAQ Section (NaturaX Modern Style + Sidebar) */}
      <section id="faq" className="py-16 bg-gradient-to-b from-[#FFFFFF] to-[#F2F2F2] scroll-mt-48">
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
                    key={index}
                    className="group rounded-[5px] bg-white p-8 transition-all duration-300 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="text-xl font-medium text-[#111] tracking-tight pr-8">
                        {item.question}
                      </h3>
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${openFaqIndex === index ? 'bg-[#16A34A] rotate-90' : 'bg-[#F3F4F6] group-hover:bg-[#E5E7EB]'}`}>
                        {openFaqIndex === index ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-gray-600" />}
                      </div>
                    </div>
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${openFaqIndex === index ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Contact Card (4 cols) */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-32 rounded-[5px] bg-[#16A34A] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
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
                    <h3 className="mb-3 text-[26px] font-normal leading-tight">
                      Ainda possui dúvidas?
                    </h3>
                    <p className="mb-8 text-white/80 text-normal text-[16px]  leading-relaxed">
                      Nossa equipe de especialistas está pronta para analisar a sua lavoura.
                    </p>
                  </div>

                  <button className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-[#16A34A] transition-all hover:bg-gray-50 hover:shadow-lg active:scale-95">
                    <span>Falar com a equipe</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section (NaturaX Style) */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imgHero}
            alt="Start Journey"
            className="h-full w-full object-cover brightness-[0.4]"
          />
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

      {/* Footer (NaturaX Style) */}
      <footer id="about" className="relative bg-black pt-20 overflow-hidden scroll-mt-48">
        {/* Watermark (Behind everything) */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-64 md:bottom-[115px] select-none opacity-[0.05] w-full text-center z-0">
          <span className="text-[140px] md:text-[280px] lg:text-[min(23vw,400px)] font-bold text-white leading-none tracking-tighter whitespace-nowrap">AtmosAgro</span>
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-[56px] flex flex-col">

          {/* 1. Links Section */}
          <div className="grid gap-12 md:grid-cols-4 lg:gap-20">
            <div>
              <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Links Rápidos</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Início</a></li>
                <li><a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} className="text-base text-[#A7A7A7] hover:text-white transition-colors cursor-pointer">Soluções</a></li>
                <li><a href="#technology" onClick={(e) => scrollToSection(e, 'technology')} className="text-base text-[#A7A7A7] hover:text-white transition-colors cursor-pointer">Tecnologia</a></li>
                <li><a href="#plans" onClick={(e) => scrollToSection(e, 'plans')} className="text-base text-[#A7A7A7] hover:text-white transition-colors cursor-pointer">Planos</a></li>
                <li><a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="text-base text-[#A7A7A7] hover:text-white transition-colors cursor-pointer">Dúvidas</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-base text-[#A7A7A7] hover:text-white transition-colors cursor-pointer">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Saiba Mais</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Cases</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Política</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Produtos</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Monitoramento Inteligente</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Análise Nutricional</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Gestão de Pragas</a></li>
                <li><a href="#" className="text-base text-[#A7A7A7] hover:text-white transition-colors">Relatórios ESG</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-8 text-sm font-semibold text-white/40 uppercase tracking-widest">Newsletter</h4>
              <div className="flex flex-col gap-6">
                {/* Newsletter Form */}
                <div className="relative w-full max-w-sm">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full h-14 bg-[#111] border border-white/20 rounded-full px-6 pr-32 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-white text-black font-medium px-6 rounded-full hover:bg-gray-200 transition-colors">
                    Inscrever
                  </button>
                </div>

                {/* Contact Info (Compact) */}
                <ul className="space-y-2">
                  <li className="text-base text-[#A7A7A7]">contato@atmosagro.com</li>
                  <li className="text-base text-[#A7A7A7]">+55 (11) 99999-9999</li>
                  <li className="text-base text-[#A7A7A7]">Av. Paulista, 1000 - SP</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Logo Section (Left Aligned on Desktop, Centered on Mobile) */}
          <div className="py-20 flex justify-center md:justify-start items-center">
            <img
              src="/images/ic_atmosAgro_full_white.svg"
              alt="AtmosAgro"
              className="h-24 md:h-32 lg:h-40 opacity-100"
            />
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
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black hover:border-white">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button (Fixed) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, display: isMenuOpen ? 'none' : 'flex' }}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#34A853] text-white shadow-lg transition-all duration-300 hover:bg-[#2E9648] hover:scale-110 hover:shadow-xl ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <ChevronsUp className="h-8 w-8" />
      </button>

    </div>
  );
};

export default Landing;
