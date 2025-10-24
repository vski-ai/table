import { Signal } from "@preact/signals";
import { DateFormatting as DateFormattingType } from "./types.ts";

export const DateFormatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const dateFormatting = formatting.value[column]?.date ||
    { granularity: "auto", showAsSpan: false };

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
        <select
          class="select select-bordered"
          value={dateFormatting.granularity}
          onChange={(e) =>
            onDateChange({
              ...dateFormatting,
              granularity: e.currentTarget.value,
            })}
        >
          <option value="auto">Auto</option>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
          <option value="second">Second</option>
        </select>
      </div>
      <div class="form-control w-full">
        <label class="label cursor-pointer">
          <span class="label-text">Show as span</span>
          <input
            type="checkbox"
            class="toggle"
            checked={dateFormatting.showAsSpan}
            onChange={(e) =>
              onDateChange({
                ...dateFormatting,
                showAsSpan: e.currentTarget.checked,
              })}
          />
        </label>
      </div>
      <div class="form-control flex flex-col gap-1 w-full">
        <label class="label">
          <span class="label-text">Locale</span>
        </label>
        <input
          type="text"
          placeholder="e.g., en-US, fr-FR"
          class="input input-bordered w-full max-w-xs"
          value={dateFormatting.locale ?? ""}
          onInput={(e) =>
            onDateChange({
              ...dateFormatting,
              locale: e.currentTarget.value,
            })}
        />
      </div>
    </div>
  );
};
