# AtmosAgro Web (Next.js)

Frontend Next.js (App Router) com React 19, Tailwind/shadcn e integrações prontas para a API atual (FastAPI em `/api`) e futura API Node. Este README consolida stack, rotas, scripts, variáveis e recomendações (adaptado do documento de tecnologias do Vite).

## Stack principal
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (radix) + class-variance-authority
- TanStack React Query (server-state/cache)
- React Hook Form + Zod (validação)
- Recharts (gráficos) e Lucide/Phosphor (ícones)
- Fonte Geist via `next/font`

## Estrutura relevante
```
web/
  src/
    app/                 # rotas Next (App Router)
      page.tsx           # landing
      login|registrar|recuperar|reset-password
      dashboard          # dashboard mock
      mapa-interativo    # hotspots
      analises           # consumo de API / jobs (mock)
      talhoes            # comparativo
      relatorios         # stub
      app|hotspots       # aliases para mapa-interativo
    components/          # Layout, UI (shadcn), landing, dashboard, auth
    lib/api-client.ts    # wrapper fetch (NEXT_PUBLIC_API_URL)
    services/            # auth/password calls
    providers/Providers  # React Query, tooltips, toasters
```

## Scripts
- `npm run dev` — servidor Next (http://localhost:3000).
- `npm run build` — build de produção.
- `npm run start` — start em produção.
- `npm run lint` — ESLint.

## Variáveis de ambiente
Crie `.env` na pasta `web`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api   # FastAPI em dev (mantém caminhos relativos /api)
NEXT_PUBLIC_SHOW_RESET_TOKEN=false
```
Recomendação: manter chamadas relativas (`/api`, `/mapas`, `/tabelas`) e usar reverse proxy em produção com os mesmos caminhos (como já era no Vite).

## Rotas atuais (mock)
- `/` landing
- `/login`, `/registrar`, `/recuperar`, `/reset-password`
- `/dashboard`
- `/mapa-interativo` (hotspots) + aliases `/app`, `/hotspots`
- `/analises` (produtos, índices, mapa, jobs — consumo via fetch)
- `/talhoes` (comparativo)
- `/relatorios` (stub)

## Integração com API
- Wrapper: `src/lib/api-client.ts` (usa `NEXT_PUBLIC_API_URL`).
- Serviços prontos: `src/services/auth.ts`, `src/services/password.ts`.
- Modelo de sessão: `src/lib/auth-session.ts` (local/session storage).
- Para jobs/índices/mapa (página Analises) use fetch com base relativa ou `NEXT_PUBLIC_API_URL`.
- Sugestão (do doc de recomendações):
  - Manter chamadas relativas em dev/prod e usar proxy/reverse proxy.
  - Validar payloads sensíveis com Zod; opcional gerar tipos com `openapi-typescript` a partir de `/openapi.json`.
  - Polling de jobs: refetch a cada 2–5s até `succeeded/failed`.

## Estilo/Tailwind
- Config em `tailwind.config.js` (content inclui `app/**/*`, `src/**/*`).
- Tokens adicionais: cores `landing`, `auth`, `alert`, `card` etc.
- Estilos globais em `src/app/globals.css`.

## Boas práticas e roadmap
- Centralizar requisições em `lib/api-client` e serviços; manter caminhos relativos.
- Se a API Node entrar em produção separada, expor prefixo dedicado (ex.: `/node-api`) e usar proxy.
- Adicionar testes com Vitest/RTL quando o contrato estabilizar.
- Remover lockfiles duplicados para eliminar warnings do Next (manter só o da pasta `web`).

## Execução local
```
cd Web/cana-vision-web/web
npm install
npm run dev
```
Frontend em http://localhost:3000. Certifique-se de ter a API disponível em `NEXT_PUBLIC_API_URL` (ou use o proxy com `/api` se estiver no mesmo host).
