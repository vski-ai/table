import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { DateFormatting as DateFormattingType } from "./types.ts";
import { LocaleSelector } from "@/menu/LocaleSelector.tsx";
import { GranularitySelector } from "@/menu/GranularitySelector.tsx";

export const DateFormatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const dateFormatting = formatting.value[column]?.date ||
    { granularity: "auto" };
  const selectedLocale = useSignal(dateFormatting.locale);

  useSignalEffect(() => {
    onDateChange({
      ...dateFormatting,
      locale: selectedLocale.value,
    });
  });

  const onDateChange = (newDateFormatting: DateFormattingType) => {
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        date: newDateFormatting,
      },
    };
  };

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
};
