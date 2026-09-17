"use client";

import { useQuery } from "@tanstack/react-query";
import type { ListFilters } from "@/features/stop-list/model/filters";
import { menuListOptions } from "@/features/stop-list/model/queries";
import { useResumeItem } from "@/features/stop-list/model/use-resume-item";
import { useStopItem } from "@/features/stop-list/model/use-stop-item";
import { useStopListUi } from "@/features/stop-list/model/ui-store";
import { Filters } from "@/features/stop-list/ui/Filters";
import { StopListTable } from "@/features/stop-list/ui/StopListTable";
import { StopReasonPanel } from "@/features/stop-list/ui/StopReasonPanel";
import { Button, Toast } from "@/shared/ui";

export function StopList({ filters }: { filters: ListFilters }) {
  const query = useQuery(menuListOptions(filters));
  const stop = useStopItem(filters);
  const resume = useResumeItem(filters);
  const selectedId = useStopListUi((state) => state.selectedId);
  const pendingIds = useStopListUi((state) => state.pendingIds);
  const toasts = useStopListUi((state) => state.toasts);
  const openPanel = useStopListUi((state) => state.openPanel);
  const closePanel = useStopListUi((state) => state.closePanel);
  const dismissToast = useStopListUi((state) => state.dismissToast);

  const items = query.data ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-8 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-[#5c574e]">Кухня · смена</p>
        <h1 className="text-3xl font-semibold tracking-tight">Стоп-лист</h1>
        <p className="text-[#5c574e]">
          Позиции меню смены: фильтр, постановка в стоп и возврат в продажу.
        </p>
      </header>

      <Filters />

      {query.isPending && !query.data ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[#e4ded4] bg-white px-4 py-10 text-center text-[#5c574e]"
        >
          Загружаем меню…
        </p>
      ) : null}

      {query.isError ? (
        <div
          role="alert"
          className="rounded-xl border border-accent/20 bg-white px-4 py-10 text-center"
        >
          <p className="text-accent">Не удалось загрузить список</p>
          <Button className="mt-4" onClick={() => query.refetch()}>
            Повторить
          </Button>
        </div>
      ) : null}

      {query.isSuccess && items.length === 0 ? (
        <p
          role="status"
          className="rounded-xl border border-[#e4ded4] bg-white px-4 py-10 text-center text-[#5c574e]"
        >
          По фильтру ничего не нашлось
        </p>
      ) : null}

      {items.length > 0 ? (
        <StopListTable
          items={items}
          pendingIds={pendingIds}
          selectedId={selectedId}
          onSelect={openPanel}
          onResume={(id) => resume.mutate(id)}
        />
      ) : null}

      <StopReasonPanel
        item={selected}
        loading={stop.isPending}
        onClose={closePanel}
        onSubmit={(payload) => {
          if (!selected) return;
          stop.mutate(
            { id: selected.id, payload },
            { onSuccess: () => closePanel() },
          );
        }}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
