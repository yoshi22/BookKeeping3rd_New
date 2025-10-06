# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Expo Router layouts and screens (tabs, mock exam flows). Keep UI entrypoints here and import shared logic from `src/`.
- `src/` hosts typed modules (`components/`, `learning-system/`, `services/`, `context/`, `utils`). Prefer colocating domain assets inside these folders instead of creating new top-level trees.
- `assets/` stores images/audio for the Expo bundler; keep new media grouped by feature.
- `__tests__/` collects Jest unit/integration specs; mirror the `src/` path.
- `e2e/` contains Detox flows with its own `jest.config.js`; keep device fixtures under `e2e/setup`.
- Supporting directories: `scripts/` for node automation, `docs/` for architecture notes, `backup/` for SQL seeds (leave untouched).

## Build, Test, and Development Commands
- `npm start` launches the Expo dev server with fast refresh.
- `npm run android` / `npm run ios` build and install the native dev clients.
- `npm run lint` runs ESLint with the Expo profile.
- `npm test` executes Jest unit tests and emits coverage in `coverage/`.
- `npm run check:quick` runs type-checks, lint, and tests together before CI.
- E2E: `npx detox build -c ios.debug && npx detox test -c ios.debug` (switch to `android.debug` for Android runs).

## Coding Style & Naming Conventions
- TypeScript-first codebase; keep strict compiler options enabled before merging.
- Prettier enforces 2-space indentation, double quotes, and trailing commas.
- Components and screens use PascalCase `.tsx`; hooks are camelCase starting with `use`; services use kebab-case files exporting camelCase functions.
- Prefer functional React components; move non-visual logic into `src/learning-system` or `src/utils` modules.

## Testing Guidelines
- Place unit specs beside implementations or under `__tests__`, naming files `*.test.tsx?`.
- Mock shared modules with files under `__mocks__`.
- Aim for a green `npm run check:quick` before pushing; update Jest snapshots intentionally.
- Record Detox runs in `e2e/reports/` via `jest-junit`; investigate flaky tests quickly.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `build:`, etc.) with concise Japanese or English summaries, mirroring the existing history.
- Reference issue IDs in the body when applicable; call out SQLite schema or data changes explicitly.
- PRs should include a problem/solution summary, testing checklist (commands run), screenshots for UI changes, and EAS build considerations when relevant.
- Request review only after CI passes and repository SQLite files remain untouched unless intentionally modified.


## other request
- Please provide all answers in Japanese
