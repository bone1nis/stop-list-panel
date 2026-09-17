import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, StopItemPayload } from "@/entities/menu-item";
import { postStop } from "./api";
import type { ListFilters } from "./filters";
import { menuKeys } from "./queries";
import { replaceItem } from "./replace-item";
import { useStopListUi } from "./ui-store";

export function useStopItem(filters: ListFilters) {
  const qc = useQueryClient();
  const listKey = menuKeys.list(filters);
  const addPending = useStopListUi((state) => state.addPending);
  const removePending = useStopListUi((state) => state.removePending);
  const pushToast = useStopListUi((state) => state.pushToast);

  return useMutation({
    mutationFn: (vars: { id: string; payload: StopItemPayload }) =>
      postStop(vars.id, vars.payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData<MenuItem[]>(listKey) ?? [];
      const prevItem = prev.find((item) => item.id === id);
      const index = prev.findIndex((item) => item.id === id);
      qc.setQueryData<MenuItem[]>(listKey, (items = []) => {
        const next = items.map((item) =>
          item.id === id
            ? { ...item, status: { kind: "stopped" as const, ...payload } }
            : item,
        );
        if (filters.status === "available") {
          return next.filter((item) => item.id !== id);
        }
        return next;
      });
      addPending(id);
      return { prevItem, index };
    },
    onError: (error, { id }, ctx) => {
      qc.setQueryData<MenuItem[]>(listKey, (items = []) =>
        replaceItem(items, id, ctx?.prevItem, ctx?.index),
      );
      pushToast(
        error instanceof Error ? error.message : "Не удалось сохранить",
      );
    },
    onSettled: (_data, error, { id }) => {
      removePending(id);
      if (!error) qc.invalidateQueries({ queryKey: listKey });
    },
  });
}
