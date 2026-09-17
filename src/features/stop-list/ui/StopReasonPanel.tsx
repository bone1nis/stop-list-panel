"use client";

import { useEffect, useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MenuItem, StopItemPayload } from "@/entities/menu-item";
import { stopItemPayloadSchema, stopReasonLabels } from "@/entities/menu-item";
import { Button, Checkbox, DateTimePicker, Modal, Select } from "@/shared/ui";

function roundToStep(iso: string) {
  const step = 15 * 60 * 1000;
  const parsed = Date.parse(iso);
  const base = Number.isNaN(parsed) ? Date.now() : parsed;
  return new Date(Math.ceil((base + 1) / step) * step).toISOString();
}

const reasons = [
  "out_of_stock",
  "equipment",
  "quality",
  "menu_change",
] as const;

interface StopReasonPanelProps {
  item: MenuItem | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: StopItemPayload) => void;
}

export function StopReasonPanel({
  item,
  loading,
  onClose,
  onSubmit,
}: StopReasonPanelProps) {
  const editing = item?.status.kind === "stopped";
  const form = useForm<StopItemPayload>({
    resolver: zodResolver(stopItemPayloadSchema),
    mode: "onBlur",
    defaultValues: {
      reason: "out_of_stock",
      until: null,
    },
  });

  useEffect(() => {
    if (!item) return;
    if (item.status.kind === "stopped") {
      form.reset({
        reason: item.status.reason,
        until: item.status.until,
      });
      return;
    }
    form.reset({ reason: "out_of_stock", until: null });
  }, [item, form]);

  const until = useWatch({ control: form.control, name: "until" });
  const reason = useWatch({ control: form.control, name: "reason" });
  const untilError = form.formState.errors.until?.message;
  const reasonError = form.formState.errors.reason?.message;
  const reasonId = useId();
  const reasonErrorId = useId();
  const untilErrorId = useId();
  const untilGroupId = useId();
  const untilPickerId = useId();

  if (!item) return null;

  return (
    <Modal open={Boolean(item)} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content
        labelledBy="stop-panel-title"
        describedBy="stop-panel-desc"
      >
        <h2 id="stop-panel-title" className="px-5 pt-5 text-lg font-semibold">
          {editing ? "Изменить стоп" : "Поставить в стоп"}
        </h2>
        <p id="stop-panel-desc" className="mt-1 px-5 text-sm text-[#5c574e]">
          {item.title}
        </p>
        <form
          className="mt-4 flex min-h-0 flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-4">
            <div className="flex flex-col gap-1 text-sm">
              <label htmlFor={reasonId}>Причина</label>
              <Select
                id={reasonId}
                overlay={false}
                invalid={Boolean(reasonError)}
                describedBy={reasonError ? reasonErrorId : undefined}
                value={reason}
                options={reasons.map((value) => ({
                  value,
                  label: stopReasonLabels[value],
                }))}
                onChange={(value) => {
                  const parsed = reasons.find((reason) => reason === value);
                  if (!parsed) return;
                  form.setValue("reason", parsed, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onBlur={() => form.trigger("reason")}
              />
              {reasonError ? (
                <span
                  id={reasonErrorId}
                  className="text-xs text-accent"
                  role="alert"
                >
                  {reasonError}
                </span>
              ) : null}
            </div>

            <fieldset className="flex flex-col gap-2 text-sm">
              <legend id={untilGroupId}>Срок</legend>
              <Checkbox
                name={untilGroupId}
                value="shift"
                checked={until === null}
                onChange={(checked) => {
                  if (checked) {
                    form.setValue("until", null, { shouldValidate: true });
                  }
                }}
              >
                До конца смены
              </Checkbox>
              <Checkbox
                name={untilGroupId}
                value="until"
                checked={until !== null}
                onChange={(checked) => {
                  if (checked) {
                    form.setValue(
                      "until",
                      roundToStep(new Date().toISOString()),
                      {
                        shouldValidate: true,
                      },
                    );
                  }
                }}
              >
                До конкретного времени
              </Checkbox>
              {until !== null ? (
                <DateTimePicker
                  id={untilPickerId}
                  value={until}
                  invalid={Boolean(untilError)}
                  describedBy={untilError ? untilErrorId : undefined}
                  onChange={(iso) =>
                    form.setValue("until", iso, { shouldValidate: true })
                  }
                  onBlur={() => form.trigger("until")}
                />
              ) : null}
              {untilError ? (
                <span
                  id={untilErrorId}
                  className="text-xs text-accent"
                  role="alert"
                >
                  {untilError}
                </span>
              ) : null}
            </fieldset>
          </div>

          <div className="flex gap-2 border-t border-[#e4ded4] bg-white px-5 py-4">
            <Button type="submit" loading={loading}>
              {loading ? "Сохранение…" : "Сохранить"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
