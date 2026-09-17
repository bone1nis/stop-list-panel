import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MenuItem } from "@/entities/menu-item";
import { postStop } from "./api";
import { menuKeys } from "./queries";
import { useStopItem } from "./use-stop-item";
import { useStopListUi } from "./ui-store";

vi.mock("./api", () => ({
  postStop: vi.fn(),
}));

const items: MenuItem[] = [
  {
    id: "a",
    title: "Борщ",
    shop: "kitchen",
    stock: 3,
    status: { kind: "available" },
    updatedAt: "t",
  },
  {
    id: "b",
    title: "Эспрессо",
    shop: "bar",
    stock: 3,
    status: { kind: "available" },
    updatedAt: "t",
  },
];

afterEach(() => {
  useStopListUi.setState({
    selectedId: null,
    pendingIds: [],
    toasts: [],
  });
});

describe("useStopItem", () => {
  it("при ошибке откатывает только упавшую строку", async () => {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    client.setQueryData(menuKeys.list({}), items);

    let rejectFirst: (error: Error) => void = () => {};
    const first = new Promise<MenuItem>((_resolve, reject) => {
      rejectFirst = reject;
    });
    vi.mocked(postStop).mockImplementation((id) => {
      if (id === "a") return first;
      return new Promise(() => {});
    });

    const { result } = renderHook(() => useStopItem({}), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        id: "a",
        payload: { reason: "quality", until: null },
      });
      result.current.mutate({
        id: "b",
        payload: { reason: "equipment", until: null },
      });
    });

    await waitFor(() => {
      const data = client.getQueryData<MenuItem[]>(menuKeys.list({}));
      expect(data?.find((item) => item.id === "a")?.status.kind).toBe(
        "stopped",
      );
      expect(data?.find((item) => item.id === "b")?.status.kind).toBe(
        "stopped",
      );
    });

    await act(async () => {
      rejectFirst(new Error("Сервер временно недоступен"));
    });

    await waitFor(() => {
      const data = client.getQueryData<MenuItem[]>(menuKeys.list({}));
      expect(data?.find((item) => item.id === "a")?.status.kind).toBe(
        "available",
      );
      expect(data?.find((item) => item.id === "b")?.status.kind).toBe(
        "stopped",
      );
    });
  });
});
