import type { DashboardData } from "./types";

export const dashboardData: DashboardData = {
  layout: {
    title: "Dashboard de Monitoramento",
    description: "Visao geral da saude das lavouras com deteccao inteligente de hotspots",
  },
  hero: {
    title: "Dashboard de Monitoramento",
    subtitle: "Visao geral da saude das suas lavouras com deteccao inteligente de hotspots",
  },
  metrics: [
    {
      id: "alerts",
      label: "Total de Alertas",
      value: "12",
      helper: "+3 nas ultimas 24h",
      icon: "alert",
      tone: "high",
    },
    {
      id: "area-total",
      label: "Area Total Monitorada",
      value: "248 ha",
      helper: "32 talhoes ativos",
      icon: "map",
      tone: "primary",
    },
    {
      id: "area-afetada",
      label: "Area Afetada",
      value: "15 ha",
      helper: "6% da area total",
      icon: "activity",
      tone: "medium",
    },
    {
      id: "nivel-risco",
      label: "Nivel de Risco Medio",
      helper: "Requer acao imediata",
      icon: "trend",
      tone: "high",
      badge: {
        label: "Alto",
        tone: "high",
      },
    },
  ],
  alerts: {
    title: "Alertas Criticos Recentes",
    items: [
      {
        id: "alerta-praga",
        title: "Praga - Talhao A-03",
        date: "Detectado em 15/07/2024",
        severity: "high",
        badge: "ALTA",
      },
      {
        id: "alerta-ferrugem",
        title: "Ferrugem - Talhao B-07",
        date: "Detectado em 14/07/2024",
        severity: "medium",
        badge: "MEDIA",
      },
      {
        id: "alerta-estresse",
        title: "Estresse Hidrico - C-12",
        date: "Detectado em 12/07/2024",
        severity: "low",
        badge: "BAIXA",
      },
    ],
    cta: {
      label: "Ver todos os alertas",
      to: "/analises",
    },
  },
  quickActions: {
    title: "Acoes Rapidas",
    items: [
      {
        id: "acao-hotspots",
        label: "Ver Dashboard de Hotspots",
        icon: "map",
        to: "/analises",
        appearance: "secondary",
      },
      {
        id: "acao-talhoes",
        label: "Comparar Talhoes",
        icon: "activity",
        to: "/talhoes",
        appearance: "secondary",
      },
      {
        id: "acao-monitoramento",
        label: "+ Novo Monitoramento",
        icon: "trend",
        appearance: "primary",
      },
    ],
  },
  systemOverview: {
    title: "Sobre o Sistema de Monitoramento",
    columns: [
      {
        title: "Indices Espectrais Monitorados",
        items: [
          "- NDVI, EVI, SAVI - Vigor e biomassa aerea",
          "- NDRE, CI Red-edge - Clorofila e estado nutricional",
          "- NDWI, NDMI - Conteudo de agua no dossel",
          "- MSI - Estresse hidrico",
        ],
      },
      {
        title: "Regras de Diagnostico",
        items: [
          "- Regra 1 - Seca provavel: NDVI baixo + baixa chuva",
          "- Regra 2 - Estresse nao hidrico: NDRE baixo com NDMI estavel",
          "- Regra 3 - Area critica: queda abrupta localizada",
          "- Regra 4 - Recuperacao: subida apos intervencao",
        ],
      },
    ],
  },
};
