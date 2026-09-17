import type { Shop, StatusFilter, StopReason } from "./types";

export const shopLabels: Record<Shop, string> = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
};

export const statusFilterLabels: Record<StatusFilter, string> = {
  available: "В продаже",
  stopped: "В стоп-листе",
};

export const stopReasonLabels: Record<StopReason, string> = {
  out_of_stock: "Закончились продукты",
  equipment: "Сломалось оборудование",
  quality: "Вопросы к качеству партии",
  menu_change: "Позиция выведена из меню смены",
};
