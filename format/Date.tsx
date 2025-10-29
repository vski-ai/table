import { memo } from "preact/compat";
import { useCallback, useEffect } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
import { DateFormatting as DateFormattingType } from "./types.ts";
import { LocaleSelector } from "@/menu/LocaleSelector.tsx";
import { GranularitySelector } from "@/menu/GranularitySelector.tsx";

export const DateFormatting = memo((
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const dateFormatting = formatting.value[column]?.date ||
    { granularity: "auto" };
  const selectedLocale = useSignal(dateFormatting.locale);

  const onDateChange = useCallback((newDateFormatting: DateFormattingType) => {
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        date: newDateFormatting,
      },
    };
  }, [formatting, column]);

  useEffect(() => {
    onDateChange({
      ...dateFormatting,
      locale: selectedLocale.value,
    });
  }, [onDateChange, dateFormatting, selectedLocale.value]);

  return (
    <div class="transition-none flex flex-col items-start gap-2 py-6">
      <div class="form-control flex flex-col gap-1 w-full">
        <label class="label">
          <span class="label-text">Granularity</span>
        </label>
        <GranularitySelector
          value={dateFormatting.granularity}
          onChange={(granularity) =>
            onDateChange({
              ...dateFormatting,
              granularity,
            })}
        />
      </div>
      <div class="form-control flex flex-col gap-1 w-full">
        <label class="label">
          <span class="label-text">Locale</span>
        </label>
        <LocaleSelector selectedLocale={selectedLocale} />
      </div>
    </div>
  );
});
