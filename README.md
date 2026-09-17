# Панель стоп-листа

Один экран для менеджера смены: меню, фильтры по цеху и статусу, постановка позиции в стоп и возврат в продажу. Бэкенда нет — данные в памяти процесса, API — route handlers.

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

- Next.js 16 (App Router) + React 19 + TypeScript strict
- TanStack Query — список с сервера
- Zustand — только UI: открытая позиция, тосты, «запрос летит»
- React Hook Form + Zod — одна схема на форму и `POST .../stop`
- Motion — модалка, смена статуса, тост
- Tailwind CSS

## Архитектура

Взяли Feature-Sliced Design, чтобы не сваливать всё в одно место. Вёрстка таблицы — само по себе, запросы и форма стопа — само по себе, описание блюда (поля, валидация) — само по себе. Таблица в API не ходит. Второй экран добавится рядом, а не внутрь этого.

```text
src/app/                 маршруты Next: layout, page, providers, API
src/widgets/stop-list/   сборка экрана из фич
src/features/stop-list/  сценарий: фильтры, таблица, стоп / резюм
src/entities/menu-item/  сущность: типы, Zod, подписи
src/shared/ui            переиспользуемые компоненты
src/shared/api/server    in-memory store, только из route handlers
```

Импорты только вниз: `app` → `widgets` → `features` → `entities` → `shared`. UI не ходит в `fetch`.

`page.tsx` — серверный компонент: читает `searchParams` и отдаёт фильтры в виджет. Список, клики и форма — клиент.

## Решения

Список — в Query (ключ = фильтры), в Zustand только открытая строка и тосты. После «Сохранить» строка уже в стопе; ошибка сервера откатывает только её, иначе заденет соседнюю, которая ещё сохраняется. Фильтры в URL через `router.push`, список грузим на клиенте, GET не кэшируем. Ошибку загрузки списка смотри в DevTools: Network → Block `/api/menu-items`.

## Что бы доделала

- eslint-boundaries, чтобы слои нельзя было импортировать вверх
- публичный `index.ts` у фичи, когда появится второй экран
- убрать доменную `validateUntil` из shared-календаря (сейчас пикер знает правила стопа)
