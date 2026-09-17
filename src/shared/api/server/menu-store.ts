import type {
  MenuItem,
  Shop,
  StatusFilter,
  StopItemPayload,
} from "@/entities/menu-item";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const STEP_MS = 15 * 60 * 1000;

function isoNow() {
  return new Date().toISOString();
}

function aheadHours(hours: number) {
  const rounded =
    Math.ceil((Date.now() + hours * 60 * 60 * 1000) / STEP_MS) * STEP_MS;
  return new Date(rounded).toISOString();
}

const now = isoNow();

const items: MenuItem[] = [
  {
    id: "1",
    title: "Борщ с пампушкой",
    shop: "kitchen",
    stock: 18,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "2",
    title: "Стейк рибай",
    shop: "kitchen",
    stock: 6,
    status: {
      kind: "stopped",
      reason: "quality",
      until: aheadHours(4),
    },
    updatedAt: now,
  },
  {
    id: "3",
    title: "Паста карбонара",
    shop: "kitchen",
    stock: 12,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "4",
    title: "Цезарь с курицей",
    shop: "kitchen",
    stock: 0,
    status: {
      kind: "stopped",
      reason: "out_of_stock",
      until: null,
    },
    updatedAt: now,
  },
  {
    id: "5",
    title: "Том ям",
    shop: "kitchen",
    stock: 9,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "6",
    title: "Эспрессо",
    shop: "bar",
    stock: 40,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "7",
    title: "Негрони",
    shop: "bar",
    stock: 8,
    status: {
      kind: "stopped",
      reason: "equipment",
      until: aheadHours(6),
    },
    updatedAt: now,
  },
  {
    id: "8",
    title: "Лимонад базилик",
    shop: "bar",
    stock: 22,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "9",
    title: "Пиво светлое",
    shop: "bar",
    stock: 15,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "10",
    title: "Наполеон",
    shop: "pastry",
    stock: 7,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "11",
    title: "Чизкейк",
    shop: "pastry",
    stock: 4,
    status: {
      kind: "stopped",
      reason: "menu_change",
      until: null,
    },
    updatedAt: now,
  },
  {
    id: "12",
    title: "Круассан",
    shop: "pastry",
    stock: 11,
    status: { kind: "available" },
    updatedAt: now,
  },
  {
    id: "13",
    title: "Тирамису",
    shop: "pastry",
    stock: 5,
    status: { kind: "available" },
    updatedAt: now,
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail() {
  if (Math.random() < 0.2) {
    throw new ApiError(500, "Сервер временно недоступен");
  }
}

function findItem(id: string) {
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new ApiError(404, "Позиция не найдена");
  return item;
}

export async function listMenuItems(filters: {
  shop?: Shop;
  status?: StatusFilter;
}): Promise<MenuItem[]> {
  await wait(450);
  return items.filter((item) => {
    if (filters.shop && item.shop !== filters.shop) return false;
    if (filters.status && item.status.kind !== filters.status) return false;
    return true;
  });
}

export async function stopItem(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  await wait(600);
  maybeFail();
  const item = findItem(id);
  item.status = { kind: "stopped", ...payload };
  item.updatedAt = new Date().toISOString();
  return item;
}

export async function resumeItem(id: string): Promise<MenuItem> {
  await wait(600);
  maybeFail();
  const item = findItem(id);
  if (item.stock === 0) {
    throw new ApiError(409, "Нельзя вернуть в продажу: остаток 0");
  }
  item.status = { kind: "available" };
  item.updatedAt = new Date().toISOString();
  return item;
}
