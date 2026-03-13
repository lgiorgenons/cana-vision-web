# Avaliação Técnica — CanaVision Web (Frontend)

> Projeto: `cana-vision-web` | Gerado em: 2026-03-13

---

## 1. Identificação do Sistema

**Nome:** CanaVision Web (AtmosAgro)
**Tipo:** SPA — Single Page Application para monitoramento agrícola de cana-de-açúcar
**Framework:** Next.js 16.1.1 + React 19 + TypeScript
**Objetivo:** Interface para visualização de imagens de satélite, gestão de propriedades/talhões e análise de índices vegetativos (NDVI, NDWI, etc.)
**Versão:** 0.1.0 — pré-produção

### Fluxo macro do usuário
```
Landing Page → Login/Cadastro
  → Dashboard (métricas gerais)
  → Propriedades (CRUD de fazendas e talhões)
  → Mapa Interativo (visualização GeoTIFF/NDVI sobre mapa Leaflet)
  → Análises / Relatórios (em construção)
```

---

## 2. Estado Atual — O que está pronto

| Módulo / Página | Status | Observação |
|---|---|---|
| Landing page completa | ✅ 100% | Hero, soluções, tecnologia, preços, FAQ, footer |
| Login | ✅ 100% | Validação Zod, sessão persistida |
| Cadastro | ✅ 90% | Falta confirmação de e-mail funcional |
| Recuperação de senha | ⚠️ 30% | Página existe, lógica incompleta |
| Reset de senha | ⚠️ 30% | Página existe, lógica incompleta |
| Dashboard | ⚠️ 50% | Layout completo, dados são todos mock |
| Mapa Interativo (Leaflet + GeoTIFF) | ✅ 85% | Funcional, GeoRaster integrado |
| CRUD Propriedades | ✅ 95% | List, create, edit, delete funcionando |
| CRUD Talhões | ✅ 90% | List, create, edit, delete funcionando |
| Comparação de Talhões | ⚠️ 40% | UI scaffolding, sem dados reais |
| Análises | ❌ 10% | Página existe, vazia |
| Relatórios | ❌ 10% | Página existe, vazia |
| Dark mode | ⚠️ 20% | Toggle UI existe, lógica não conectada |
| Notificações em tempo real | ❌ 0% | Não implementado |
| Perfil de usuário | ❌ 0% | Não implementado |
| Testes | ❌ 0% | Nenhum teste escrito |

---

## 3. Análise de Segurança

### 3.1 Pontos positivos
- **Zod** em todos os formulários — validação forte no cliente
- **Bearer token** em todas as chamadas autenticadas
- **API proxy via rewrites** no `next.config.ts` — URL interna não exposta ao browser em dev

### 3.2 Vulnerabilidades e riscos

#### 🔴 Crítico

**SEC-01 — Token JWT armazenado em `localStorage`**
```typescript
// src/lib/auth-session.ts
localStorage.setItem('atmos-auth-session', JSON.stringify(session));
```
- **Risco:** Qualquer script (XSS) na página pode ler o token
- **Impacto:** Comprometimento total da conta do usuário
- **Correção:** Usar cookies HTTP-only (o backend já suporta isso — `Set-Cookie` nos endpoints de auth). Remover o `localStorage` e confiar nos cookies.

**SEC-02 — IP de produção hardcoded em `next.config.ts`**
```typescript
// web/next.config.ts
destination: 'http://34.148.81.131:3000/api/:path*'
```
- **Risco:** IP interno exposto no repositório; sem separação dev/staging/prod
- **Correção:** Usar variável de ambiente `NEXT_PUBLIC_API_URL`

#### 🟡 Alto

**SEC-03 — Sem lógica de refresh token**
- `accessToken` expira (Supabase: 1h por padrão) e não há refresh automático
- **Risco:** Usuário fica com token expirado sem saber; requests falham silenciosamente
- **Correção:** Interceptor no `api-client.ts` que detecta 401 e chama `/auth/refresh-token`

**SEC-04 — Sem proteção de rotas via middleware Next.js**
- Proteção de rotas feita manualmente em cada componente
- **Risco:** Rotas privadas podem ser acessadas antes da checagem carregar
- **Correção:** Criar `middleware.ts` na raiz do `web/` com `matcher` para rotas protegidas

```typescript
// web/src/middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('atmos-auth-session');
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = { matcher: ['/dashboard/:path*', '/propriedades/:path*', ...] };
```

**SEC-05 — GeoJSON de entrada não sanitizado**
- Polígonos desenhados no mapa são enviados diretamente para a API
- **Risco:** Coordenadas maliciosas ou excessivamente grandes
- **Correção:** Validar geometria com Turf.js antes de enviar (área razoável, polígono fechado, sem auto-interseção)

#### 🟠 Médio

**SEC-06 — `useUserStore.ts` vazio — dados do usuário em `localStorage`**
- Sem store global o usuário é lido do `localStorage` a cada render
- **Risco:** Dados de usuário desatualizados sem invalidação adequada

**SEC-07 — Imagens de domínios externos sem restrição adequada**
- `next.config.ts` permite apenas `unsplash.com`; verificar se não há outros domínios necessários

---

## 4. Análise de Performance

### 4.1 Pontos positivos
- **Next.js App Router** — SSR/SSG onde possível
- **Dynamic import** no `InteractiveMap` — evita SSR crash do Leaflet ✅
- **React Query** — cache de server state, evita refetch desnecessário
- **Tailwind CSS** — CSS purged no build, bundle CSS pequeno
- **Geist font** — fonte do sistema Next.js otimizada

### 4.2 Gargalos e riscos

#### 🔴 Crítico

**PERF-01 — `InteractiveMap.tsx` com 61KB+**
- Arquivo único com Leaflet + GeoRaster + Proj4 + lógica de overlay
- GeoRaster + georaster-layer-for-leaflet + geoblaze = bundle enorme (~2–3MB adicionados)
- **Risco:** First Load JS acima de 500KB apenas para esta página
- **Solução:** Separar em sub-componentes + lazy load apenas quando rota `/mapa-interativo` é acessada (já está em dynamic import, verificar se está sendo tree-shaken corretamente)

**PERF-02 — Dashboard com dados mock sem integração**
- Todos os widgets carregam dados estáticos de `dashboard/data.ts`
- **Risco:** Quando integrado com API real, sem otimização pode causar waterfall de queries
- **Solução:** `useQuery` por widget com `staleTime` adequado; considerar API agregada no backend

#### 🟡 Alto

**PERF-03 — React Query sem `staleTime` configurado**
- Queries re-fetched a cada focus de janela sem cache strategy
- **Correção:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10,
    },
  },
});
```

**PERF-04 — Sem paginação nos componentes de listagem**
- Properties list busca tudo de uma vez; sem paginação visual
- **Risco:** Clientes com centenas de propriedades terão listagens lentas

**PERF-05 — Sem otimização de imagens nas páginas de propriedades**
- Imagens estáticas de culturas (`/images/properties/`) carregadas sem `next/image`
- **Correção:** Substituir `<img>` por `<Image>` do Next.js

#### 🟠 Médio

**PERF-06 — Sem Error Boundaries**
- Falha em qualquer widget do dashboard derruba a página inteira
- **Correção:** Envolver widgets com `<ErrorBoundary>` independentes

---

## 5. Qualidade de Código e Arquitetura

### 5.1 Pontos positivos
- Separação clara: `pages → components → services → api-client`
- Path alias `@/*` → `src/*` configurado e usado consistentemente
- Componentes UI reutilizáveis via shadcn/ui
- Formulários com React Hook Form + Zod — padrão sólido
- Tipos TypeScript bem definidos nos services

### 5.2 Débitos técnicos

**DT-01 — `useUserStore.ts` é arquivo vazio (0 bytes)**
- Sem Zustand store implementado
- Dados do usuário espalhados entre `auth-session.ts` e componentes locais
- **Correção:** Implementar store Zustand com `user`, `clienteId`, `role`; hidratado do `auth-session`

**DT-02 — Zero testes**
- Nenhum teste de unidade, integração ou E2E
- Formulários, serviços e fluxo de autenticação não têm cobertura
- **Prioridade:** Alta — testes de fluxo de login e CRUD de propriedades

**DT-03 — Páginas stub (`/analises`, `/relatorios`, `/recuperar`, `/reset-password`)**
- Existem no roteamento mas sem implementação
- **Risco:** Confusão para usuários que chegam nestas rotas

**DT-04 — Hardcodes no código**
- IP da API no `next.config.ts`
- `'atmos-auth-session'` como string literal em vários lugares
- `'http://34.148.81.131:3000'` sem constante

**DT-05 — Arquivo screenshot na raiz do projeto**
- `Captura de tela 2026-03-12 151936.png` commitada no root do repositório
- **Correção:** Remover e adicionar `*.png` ao `.gitignore` da raiz

**DT-06 — Dark mode configurado mas não funcional**
- `next-themes` importado, toggle de UI existe
- CSS custom properties não mapeadas para dark palette
- **Decisão:** Implementar ou remover toggle — estado meio-feito confunde usuários

**DT-07 — Sem `error.tsx` e `loading.tsx` por rota**
- Next.js App Router suporta error boundaries por segmento
- Atualmente sem tratamento de erro granular por rota

**DT-08 — Mistura de idiomas no código**
- Variáveis e comentários em português (correto para domínio do negócio)
- Alguns componentes com comentários em inglês
- **Recomendação:** Padronizar comentários de código em português

---

## 6. Plano de Ação

### Priorização por impacto/risco

| ID | Título | Prioridade | Tipo | Esforço |
|---|---|---|---|---|
| F-01 | Migrar auth de `localStorage` para cookies HTTP-only | 🔴 Crítico | Segurança | Médio |
| F-02 | Remover IP hardcoded — usar variável de ambiente | 🔴 Crítico | Segurança | Trivial |
| F-03 | Middleware Next.js para proteção de rotas | 🔴 Crítico | Segurança | Pequeno |
| F-04 | Interceptor de refresh token no `api-client.ts` | 🔴 Crítico | Segurança | Médio |
| F-05 | Implementar `useUserStore` (Zustand) | 🟡 Alto | Qualidade | Pequeno |
| F-06 | Conectar Dashboard a dados reais da API | 🟡 Alto | Feature | Grande |
| F-07 | Implementar fluxo de recuperação/reset de senha | 🟡 Alto | Feature | Médio |
| F-08 | Confirmar e-mail pós-cadastro (feedback ao usuário) | 🟡 Alto | Feature | Médio |
| F-09 | Configurar `staleTime` no React Query | 🟡 Alto | Performance | Trivial |
| F-10 | Paginação nas listagens (Propriedades, Talhões) | 🟡 Alto | Performance | Médio |
| F-11 | Error Boundaries por widget e por rota | 🟠 Médio | Qualidade | Médio |
| F-12 | `loading.tsx` e `error.tsx` por segmento de rota | 🟠 Médio | Qualidade | Pequeno |
| F-13 | Substituir `<img>` por `<Image>` do Next.js | 🟠 Médio | Performance | Pequeno |
| F-14 | Remover screenshot da raiz + atualizar `.gitignore` | 🟠 Médio | Limpeza | Trivial |
| F-15 | Escrever testes: serviços de auth e propriedades | 🟡 Alto | Qualidade | Grande |
| F-16 | Implementar dark mode completamente ou remover | 🟠 Médio | UX | Médio |
| F-17 | Validação de GeoJSON com Turf.js antes do envio | 🟠 Médio | Segurança | Médio |
| F-18 | Implementar `/analises` com dados reais | 🟢 Baixo | Feature | Grande |
| F-19 | Implementar `/relatorios` com exportação | 🟢 Baixo | Feature | Grande |
| F-20 | Perfil de usuário e configurações | 🟢 Baixo | Feature | Médio |

---

## 7. Roadmap Sugerido

### Sprint 1 — Segurança e estabilidade (sem. 1–2)
- [ ] **F-01** Migrar para cookies HTTP-only (alinhado com backend que já suporta)
- [ ] **F-02** Remover IP hardcoded → `NEXT_PUBLIC_API_URL` no `.env`
- [ ] **F-03** `middleware.ts` de proteção de rotas
- [ ] **F-04** Refresh token automático no `api-client.ts`
- [ ] **F-05** Implementar `useUserStore` com Zustand
- [ ] **F-14** Remover screenshot da raiz
- [ ] **F-09** `staleTime` no React Query

### Sprint 2 — Funcionalidades core (sem. 3–4)
- [ ] **F-06** Dashboard com dados reais (integrar endpoints existentes)
- [ ] **F-07** Fluxo completo de recuperação/reset de senha
- [ ] **F-08** Feedback correto de confirmação de e-mail
- [ ] **F-11** Error Boundaries
- [ ] **F-12** `loading.tsx` e `error.tsx` por rota

### Sprint 3 — Qualidade e UX (sem. 5–6)
- [ ] **F-10** Paginação nas listagens
- [ ] **F-13** `<Image>` do Next.js nas imagens estáticas
- [ ] **F-15** Testes (auth service, propriedades service, formulários)
- [ ] **F-16** Decidir e implementar dark mode
- [ ] **F-17** Validação de GeoJSON no frontend

### Sprint 4 — Features avançadas (sem. 7+)
- [ ] **F-18** Página de Análises com dados reais
- [ ] **F-19** Página de Relatórios com exportação
- [ ] **F-20** Perfil de usuário e configurações

---

## 8. Arquivos-chave para referência

| Arquivo | Propósito | Issue relacionada |
|---|---|---|
| `web/src/lib/auth-session.ts` | Sessão em localStorage — migrar para cookies | F-01 |
| `web/next.config.ts` | IP hardcoded | F-02 |
| `web/src/lib/api-client.ts` | HTTP client — adicionar refresh token | F-04 |
| `web/src/stores/useUserStore.ts` | Arquivo vazio — implementar Zustand store | F-05 |
| `web/src/app/dashboard/page.tsx` | Dashboard com dados mock | F-06 |
| `web/src/components/InteractiveMap.tsx` | Mapa 61KB — maior arquivo do projeto | PERF-01 |
| `web/src/providers/Providers.tsx` | React Query setup — adicionar staleTime | F-09 |
| `web/src/app/recuperar/page.tsx` | Página stub — implementar | F-07 |
| `web/src/app/reset-password/page.tsx` | Página stub — implementar | F-07 |

---

## 9. Decisão Arquitetural Recomendada — Autenticação

### Situação atual (problemática)
```
Login → JWT salvo em localStorage → enviado como Bearer header
```

### Recomendado (alinhado com backend)
O backend já define cookies HTTP-only no login. O frontend deve parar de gerenciar tokens manualmente:

```
Login → Backend seta cookie HTTP-only (accessToken + refreshToken)
     → Frontend não lê nem armazena token
     → api-client envia requisições com `credentials: 'include'`
     → Backend valida cookie automaticamente
```

**Mudanças necessárias:**
1. `api-client.ts`: adicionar `credentials: 'include'` em todas as requests
2. `auth-session.ts`: remover armazenamento de tokens; manter apenas dados do usuário (nome, role, clienteId) em memória/Zustand
3. `middleware.ts`: checar presença do cookie de sessão (não o token em si)
4. Backend: garantir que `CORS_ORIGIN` inclui o domínio do frontend com `credentials: true`

---

## 10. Maturidade do Projeto

| Área | Status | Nota |
|---|---|---|
| Landing page / Marketing | ✅ Pronto | Profissional e completo |
| Autenticação UI | ✅ Pronto | Falta lógica de refresh/reset |
| CRUD Propriedades + Talhões | ✅ Pronto | Funcional e polido |
| Mapa Interativo | ✅ Pronto | Principal diferencial do produto |
| Dashboard | ⚠️ Parcial | Layout pronto, dados mock |
| Análises / Relatórios | ❌ Stub | Aguarda backend |
| Segurança | ⚠️ Parcial | localStorage é o principal risco |
| Performance | ⚠️ Parcial | Mapa pesado, sem cache strategy |
| Testes | ❌ Zero | Nenhum teste |
| Produção-readiness | ⚠️ ~55% | Resolver auth + dados reais + testes |

---

*Documento gerado por análise estática do projeto `cana-vision-web`. Revisar junto ao time antes de priorizar.*
