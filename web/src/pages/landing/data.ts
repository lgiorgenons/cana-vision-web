export type NavLink = {
  id: string;
  label: string;
};

export type FooterLink = {
  label: string;
  href: string;
  id?: string;
};

export const landingImages = {
  logoWhite: "/images/ic_atmosAgro_full_white.svg",
  heroBackground: "/images/img_campo_hero.jpg",
  tablet: "/images/img_ipad.png",
  terrain: "/images/img_terreno.png",
  cta: "/images/img_hero.png",
} as const;

export const navLinks: NavLink[] = [
  { id: "solutions", label: "Soluções" },
  { id: "technology", label: "Tecnologia" },
  { id: "plans", label: "Planos" },
  { id: "faq", label: "Dúvidas" },
];

export const solutionFeatures = [
  {
    title: "Estresse Hídrico",
    description: "Identifique áreas com falta de água antes que afetem a produtividade.",
    icon: "/images/ic_gota_agua.svg",
    iconAlt: "Gota",
  },
  {
    title: "Visualização simplificada",
    description: "Veja índices avançados (NDVI, NDRE, NDMI) em mapas claros e simplificados.",
    icon: "/images/ic_visualizacao.svg",
    iconAlt: "Visualização",
  },
  {
    title: "Detecção de Pragas",
    description: "Detecte focos iniciais e aplique defensivos apenas onde necessário.",
    icon: "/images/ic_praga.svg",
    iconAlt: "Praga",
  },
  {
    title: "Controle de Safra",
    description: "Acompanhe o histórico da safra com relatórios automáticos.",
    icon: "/images/ic_controle_safra.svg",
    iconAlt: "Controle",
  },
] as const;

export const howItWorksSteps = [
  {
    step: "1",
    title: "Coleta de Imagens",
    description: "Monitoramos sua lavoura continuamente por imagens de satélite, cobrindo toda a área.",
    result: "O sistema destaca apenas o que realmente precisa de atenção.",
    image: "/images/img_coleta_imagens.png",
  },
  {
    step: "2",
    title: "Processamento",
    description: "Analisamos as imagens com modelos matemáticos para identificar áreas que fogem do normal.",
    result: "O sistema destaca apenas o que realmente precisa de atenção.",
    image: "/images/img_processamento.png",
  },
  {
    step: "3",
    title: "Diagnóstico e ação.",
    description: "As áreas com problema aparecem no mapa, prontas para vistoria e decisão.",
    result: "Você vai direto ao ponto certo, no momento certo.",
    image: "/images/img_diagnostico.png",
  },
] as const;

export const starterPlanFeatures = [
  "Segmentação de propriedades",
  "Identificação de talhões",
  "Histórico de 1 ano (Satélite)",
  "Filtros de Estresse Hídrico",
  "Detecção de Pragas",
  "Exportação de relatórios",
] as const;

export const enterprisePlanFeatures = [
  "Gestão de frota e maquinário",
  "Integração via API e ERP",
  "Relatórios preditivos (IA)",
  "Suporte 24/7 dedicado",
  "Múltiplos usuários e níveis",
  "Consultoria agronômica",
] as const;

export const faqData = [
  {
    question: "O que é a Plataforma AtmosAgro?",
    answer:
      "A AtmosAgro é uma solução completa de agricultura de precisão que utiliza sensores IoT e inteligência artificial para monitorar sua lavoura em tempo real, otimizando o uso de recursos e aumentando a produtividade.",
  },
  {
    question: "Como funciona o monitoramento em tempo real?",
    answer:
      "Nossos sensores coletam dados de umidade, temperatura, solo e clima a cada minuto. Essas informações são processadas e enviadas para o seu painel, permitindo decisões rápidas e baseadas em dados precisos.",
  },
  {
    question: "A plataforma serve para pequenos produtores?",
    answer:
      "Sim! A AtmosAgro é escalável. Temos planos adaptados tanto para grandes latifúndios quanto para agricultura familiar, garantindo acesso à tecnologia de ponta para todos.",
  },
  {
    question: "Preciso de internet na fazenda toda?",
    answer:
      "Não necessariamente. Nossos dispositivos utilizam tecnologia LoRaWAN de longo alcance, que permite a comunicação dos sensores mesmo em áreas com cobertura de internet limitada.",
  },
  {
    question: "Qual o suporte oferecido?",
    answer:
      "Oferecemos suporte técnico especializado 24/7, além de acompanhamento agronômico para ajudar você a interpretar os dados e tomar as melhores decisões para sua safra.",
  },
] as const;

export const footerQuickLinks: FooterLink[] = [
  { label: "Início", href: "#" },
  ...navLinks.map((link) => ({
    label: link.label,
    href: `#${link.id}`,
    id: link.id,
  })),
  { label: "Contato", href: "#about", id: "about" },
];

export const footerLearnMore = [
  { label: "Sobre Nós", href: "#" },
  { label: "Carreiras", href: "#" },
  { label: "Cases", href: "#" },
  { label: "Política", href: "#" },
] as const;

export const footerProducts = [
  { label: "Monitoramento Inteligente", href: "#" },
  { label: "Análise Nutricional", href: "#" },
  { label: "Gestão de Pragas", href: "#" },
  { label: "Relatórios ESG", href: "#" },
] as const;

export const footerContactInfo = [
  "contato@atmosagro.com",
  "+55 (11) 99999-9999",
  "Av. Paulista, 1000 - SP",
] as const;
