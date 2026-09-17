# Панель стоп-листа

Экран для менеджера зала: меню смены, фильтры, постановка позиции в стоп-лист и снятие со стопа.

## Запуск

Нужен Node 22 (см. `.nvmrc`).

```bash
npm install
npm run dev
```

или

```bash
pnpm install
pnpm dev
```

Открыть [http://localhost:3000](http://localhost:3000).

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm test
```

## Стек

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS
- TanStack Query — серверное состояние
- Zustand — только UI (панель, выбранная позиция, тосты)
- React Hook Form + Zod — одна схема на клиент и route handler
- Motion (Framer Motion) — панель и смена статуса
- ESLint + Prettier

## Слои

```text
src/app/                 # Next: layout, page, providers, route handlers
src/widgets/stop-list/   # сборка экрана
src/features/stop-list/  # фильтры URL, форма стопа, мутации
src/entities/menu-item/  # типы, Zod-схема
src/shared/ui            # Button, Select, Badge, Toast
src/shared/api/server    # сид и in-memory store
```

Импорты только вниз по слоям. UI не вызывает `fetch`.
