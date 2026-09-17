<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Как работать

- Одна задача за раз. Несвязанный рефакторинг и зависимости впрок — вне задачи.
- Node 22, pnpm, существующий lockfile. Перед командами: `nvm use 22`.
- Коммиты, push и деплой делает человек.
- После правок: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`.

## Куда вносить изменения

| Изменение | Путь |
| --------- | ---- |
| Страница, layout, провайдеры | `src/app/` |
| Route handler | `src/app/api/` |
| Сборка экрана | `src/widgets/` |
| UI фичи | `src/features/*/ui/` |
| Логика фичи (query, мутации, URL) | `src/features/*/model/` |
| Типы и схема сущности | `src/entities/` |
| Переиспользуемый UI | `src/shared/ui/` |
| In-memory store | `src/shared/api/server/` |

Редактируй исходники, не `node_modules/` и `.next/`.

## Как писать

- TypeScript strict. Без `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`.
- UI на русском.
- Импорты только вниз: `app` → `widgets` → `features` → `entities` → `shared`.
- UI не вызывает `fetch`. Store — только из route handlers.
- Список в Query, не в Zustand. Алиас один: `@/*`.
