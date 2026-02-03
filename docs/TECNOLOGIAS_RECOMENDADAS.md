# Recomendações de Tecnologias (Web) e Integração com a API

Este documento consolida recomendações para o frontend (módulo Web) visando integração perfeita com a estrutura atual da API. Foi elaborado após analisar:

- API Python (FastAPI): `API/cana-vision-api/server.py`
- Esqueleto da API Node (Express + TypeScript): `API/cana-vision-api/api`
- Frontend React + Vite: `Web/cana-vision-web/web`

## 1) Panorama da API atual

- Python (FastAPI) ativo em desenvolvimento
  - Endpoints principais (prefixo `/api`):
    - `GET /api/health` – health-check
    - `GET /api/products` – lista produtos processados
    - `GET /api/products/availability` – disponibilidade por data/intervalo e nuvens
    - `GET /api/indices?product=...` – índices disponíveis por produto
    - `GET /api/csv/{index_name}` – download de CSV gerado
    - `GET /api/map/compare` – retorna `{ url }` para o HTML comparativo gerado
    - `GET /api/map/overlay` – retorna `{ url }` para overlay se existir
    - `POST /api/jobs/run-workflow` – dispara workflow assíncrono
    - `GET /api/jobs`, `GET /api/jobs/history`, `GET /api/jobs/{job_id}` – monitoramento de jobs
  - Estáticos servidos pelo próprio backend: `/mapas`, `/tabelas`
  - CORS já liberando `http://localhost:8080` em dev
- Node (Express + TypeScript) – skeleton
  - Estrutura para domínios/rotas, validação com Zod, Prisma, JWT, BullMQ, etc.
  - Ainda sem rotas implementadas; previsto para autenticação/negócios gerais

- Vite (frontend) configurado com proxy em dev (arquivo `vite.config.ts`):
  - Proxies de `"/api"`, `"/mapas"` e `"/tabelas"` para `http://127.0.0.1:8000`
  - Porta do dev server: `8080`

Conclusão: o front já pode consumir a API Python via caminhos relativos (`/api/...`) sem CORS em dev. Em produção, recomenda-se reverse proxy com rotas equivalentes.

## 2) Stack recomendada (Web)

- Base (já no projeto):
  - React 18 + Vite + TypeScript – rápido, tipado e produtivo
  - Tailwind CSS + shadcn/ui – design system consistente e componível
  - React Router – navegação SPA
  - TanStack React Query – cache, revalidação e controle de estados de rede
  - Zod + React Hook Form – validação de dados e formulários tipados
  - Recharts – gráficos responsivos e simples de manter

- Cliente HTTP e tipagem de API:
  - Padrão: `fetch` via wrapper próprio + React Query
  - Validação de resposta com `zod` (já presente) para contratos críticos
  - Opcional para contrato 100% tipado (recomendado):
    - `openapi-typescript` para gerar tipos a partir de `http://127.0.0.1:8000/openapi.json`
    - `openapi-fetch` (ou `zodios`) para cliente typed-friendly

- Geoespacial (faseado):
  - Fase 1 (imediato): incorporar mapas gerados via `<iframe src={url} />` usando a URL de `GET /api/map/compare`
  - Fase 2: se precisarmos de visualização dinâmica no app, adotar `react-leaflet` + camadas (eg. tiles) expostas pela API, mantendo performance

- Estado global:
  - Priorizar React Query para server-state e estados locais por componente
  - Adicionar Zustand apenas se surgir necessidade de estado global complexo não-relacionado a server-state

- Testes (quando necessário):
  - Vitest + React Testing Library para componentes e hooks

## 3) Integração perfeita com a API

- Convenção de base path
  - Em dev, usar caminhos relativos (`/api`, `/mapas`, `/tabelas`) – o proxy já encaminha para o FastAPI
  - Em produção, servir o front e roteá-los pelo mesmo domínio, mantendo os mesmos caminhos via reverse proxy (NGINX/Traefik)

- Autenticação e segurança
  - A API Node indica uso de JWT; padronizar `Authorization: Bearer <token>`
  - Preferir cookie `HttpOnly` no domínio de produção para reduzir XSS; em dev, pode-se usar `localStorage`/memória com cuidado
  - Centralizar injeção de token no wrapper de fetch (interceptor before-request)

- Validação e resiliência
  - Validar payloads de respostas com `zod` para endpoints sensíveis (jobs, índices)
  - Usar `retry` e `staleTime` do React Query conforme criticidade

- Jobs e polling
  - `POST /api/jobs/run-workflow` via `useMutation`
  - Consultas a `GET /api/jobs/{id}` e/ou `GET /api/jobs` com `refetchInterval` (ex.: 2–5s) até `SUCCEEDED`/`FAILED`

- Downloads e mapas
  - Para CSV: link direto para `/api/csv/{index}` (deixa o browser gerenciar download)
  - Para mapas: obter `{ url }` de `GET /api/map/compare` e usar `<iframe src={url} />` ou abrir em nova aba

## 4) Estrutura sugerida no front

```
src/
  lib/
    api/
      client.ts         # wrapper fetch com basePath, headers, erros
      py.ts             # funções para FastAPI (/api/...)
      node.ts           # funções futuras p/ Node API
    validators/
      jobs.ts           # esquemas zod (Job, JobStatus, etc.)
      indices.ts        # esquemas zod p/ índices/produtos
  pages/
  components/
```

- `client.ts` (exemplo):

```ts
const basePath = import.meta.env.VITE_API_BASE_PATH ?? "/api";

export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${basePath}${input}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}
```

- `py.ts` (exemplo de uso com React Query):

```ts
import { apiFetch } from "./client";

export type Health = { status: string };
export const getHealth = () => apiFetch<Health>("/health");

export type CompareMap = { url: string };
export const getCompareMap = () => apiFetch<CompareMap>("/map/compare");

export type RunWorkflowPayload = {
  date?: string;
  date_range?: [string, string];
  geojson?: string;
  cloud?: [number, number];
};
export const runWorkflow = (body: RunWorkflowPayload) =>
  apiFetch<{ job_id: string; status: string }>("/jobs/run-workflow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
```

## 5) Variáveis de ambiente (Vite)

- `VITE_API_BASE_PATH` – default `"/api"` em dev e prod (via proxy/reverse proxy)
- Futuro (Node API): considerar `"/node-api"` como prefixo dedicado caso convivam 2 backends em produção e desejar isolá-los

Obs.: o arquivo `vite.config.ts` já define o proxy para FastAPI em dev; manter chamadas relativas no front evita CORS e simplifica deploy.

## 6) Tipagem via OpenAPI (recomendado)

- Adicionar no `package.json` (scripts sugeridos):
  - `"types:api": "openapi-typescript http://127.0.0.1:8000/openapi.json -o src/types/api.d.ts"`
- Consumir com `openapi-fetch` ou usar apenas os tipos gerados com `fetch`/React Query
- Benefício: contratos fortemente tipados e detecção precoce de quebra

## 7) Roadmap sugerido

1. Criar `src/lib/api/client.ts` e `src/lib/api/py.ts` com funções mostradas
2. Páginas de análise usarem React Query para:
   - healthcheck, produtos, índices, mapa comparativo, CSV
3. Implementar UI para jobs (mutations + polling com refetchInterval)
4. Quando a API Node nascer (auth/usuários/etc.):
   - Padronizar JWT Bearer no wrapper
   - Expor OpenAPI e gerar tipos no front
   - Se necessário, criar proxy `/node-api` em `vite.config.ts`
5. Produção: servir SPA + proxy `/api` (e opcional `/node-api`) no mesmo domínio

---

Resumo: manter chamadas relativas (`/api`) com proxy em dev e reverse proxy em produção garante integração perfeita com o FastAPI atual. Para robustez e produtividade, usar React Query + validação com Zod agora, e evoluir para OpenAPI gerando tipos quando a superfície da API estabilizar (incluindo a futura API Node).
