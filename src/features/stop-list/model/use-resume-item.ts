import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MenuItem } from "@/entities/menu-item";
import { postResume } from "./api";
import type { ListFilters } from "./filters";
import { menuKeys } from "./queries";
import { replaceItem } from "./replace-item";
import { useStopListUi } from "./ui-store";

export function useResumeItem(filters: ListFilters) {
  const qc = useQueryClient();
  const listKey = menuKeys.list(filters);
  const addPending = useStopListUi((state) => state.addPending);
  const removePending = useStopListUi((state) => state.removePending);
  const pushToast = useStopListUi((state) => state.pushToast);

  return useMutation({
    mutationFn: (id: string) => postResume(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData<MenuItem[]>(listKey) ?? [];
      const prevItem = prev.find((item) => item.id === id);
      const index = prev.findIndex((item) => item.id === id);
      qc.setQueryData<MenuItem[]>(listKey, (items = []) => {
        const next = items.map((item) =>
          item.id === id
            ? { ...item, status: { kind: "available" as const } }
            : item,
        );
        if (filters.status === "stopped") {
          return next.filter((item) => item.id !== id);
        }
        return next;
      });
      addPending(id);
      return { prevItem, index };
    },
    onError: (error, id, ctx) => {
      qc.setQueryData<MenuItem[]>(listKey, (items = []) =>
        replaceItem(items, id, ctx?.prevItem, ctx?.index),
      );
      pushToast(
        error instanceof Error ? error.message : "Не удалось сохранить",
      );
    },
    onSettled: (_data, error, id) => {
      removePending(id);
      if (!error) qc.invalidateQueries({ queryKey: listKey });
    },
  });
}
