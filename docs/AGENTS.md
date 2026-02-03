# Repository Guidelines

## Project Structure & Module Organization
- `API/cana-vision-api/`: Node.js + TypeScript API (Express, Prisma).
  - `src/api/` controllers, routes, validators.
  - `src/services/`, `src/repositories/`, `src/domain/`, `src/integrations/`, `src/workers/`.
  - `prisma/` schema and migrations; `scripts/` helpers.
- `Web/cana-vision-web/web/`: Vite + React frontend.
  - `src/pages/`, `src/components/`, `src/services/`, `src/assets/`.
  - `public/` static assets, `tailwind.config.ts`, `vite.config.ts`.
- `Web/cana-vision-web/docs/` and `Imagens/` contain product docs and visual references.

## Build, Test, and Development Commands
API (`API/cana-vision-api/`):
- `npm install` install deps.
- `npm run dev` start API with ts-node-dev.
- `npm run build` compile to `dist/`; `npm run start` run built server.
- `npm run prisma:generate` create Prisma client; `npm run prisma:migrate` apply local migrations.
- `npm run lint`, `npm run format`, `npm run test`.

Web (`Web/cana-vision-web/web/`):
- `npm install` install deps.
- `npm run dev` start Vite at `http://localhost:8080` (proxies `/api`, `/mapas`, `/tabelas` to `127.0.0.1:8000`).
- `npm run build` create production build; `npm run preview` serve it locally.
- `npm run lint` run ESLint.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; keep TypeScript types explicit where needed.
- API file patterns: `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.dto.ts`, `*.validator.ts`, `*.entity.ts`, `*.vo.ts`.
- React components use PascalCase; hooks use `useX`; import alias `@` maps to `web/src`.
- Use ESLint/Prettier scripts in the API and ESLint in the web app before PRs.

## Testing Guidelines
- API uses Jest with ts-jest (`API/cana-vision-api/jest.config.ts`). Place tests under `API/cana-vision-api/tests/` or alongside code as `*.test.ts`/`*.spec.ts`.
- Web has no test runner configured yet; add one if you introduce UI logic that needs coverage.

## Commit & Pull Request Guidelines
- Recent history shows short messages with prefixes like `feat:`, `fix:`, or `update:`. Keep commits concise and scoped.
- PRs should include: a brief summary, testing notes/commands, links to related issues, and screenshots or clips for UI changes.

## Configuration & Environment
- API configuration lives in `API/cana-vision-api/.env` (see `.env.example` for required `DATABASE_URL`, `SUPABASE_*`, `SICAR_API_BASE`, `CORE_WORKFLOW_BIN`).
- Postgres should have `postgis` and `uuid-ossp` extensions enabled for Prisma migrations.
