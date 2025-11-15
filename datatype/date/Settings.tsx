import { useSignal } from "@preact/signals";
import { cn } from "@/common/className.ts";
import { LocaleSelector } from "../components/LocaleSelector.tsx";
import { MenuContext } from "@/ctxmenu/types.ts";
import { resetFormatting, setFormatting } from "../mutations.ts";
import { DateDataTypeOptions } from "./types.ts";

type Style = "full" | "long" | "medium" | "short";
type Numeric2Digit = "numeric" | "2-digit";
type Weekday = "long" | "short" | "narrow";
type Era = "long" | "short" | "narrow";
type Month = "numeric" | "2-digit" | "long" | "short" | "narrow";
type TimeZoneName =
  | "long"
  | "short"
  | "shortOffset"
  | "longOffset"
  | "shortGeneric"
  | "longGeneric";

export function Settings({ store, column }: MenuContext) {
  const configMode = useSignal<"style" | "manual">("style");
  const locale = useSignal(navigator.language);
  const dateStyle = useSignal<Style>("medium");
  const timeStyle = useSignal<Style>("medium");

  const weekday = useSignal<Weekday | undefined>(undefined);
  const era = useSignal<Era | undefined>(undefined);
  const year = useSignal<Numeric2Digit | undefined>(undefined);
  const month = useSignal<Month | undefined>(undefined);
  const day = useSignal<Numeric2Digit | undefined>(undefined);
  const hour = useSignal<Numeric2Digit | undefined>(undefined);
  const minute = useSignal<Numeric2Digit | undefined>(undefined);
  const second = useSignal<Numeric2Digit | undefined>(undefined);
  const timeZoneName = useSignal<TimeZoneName | undefined>(undefined);

  const onApply = () => {
    let opts: DateDataTypeOptions;

    if (configMode.value === "style") {
      opts = {
        locale: locale.value,
        dateStyle: dateStyle.value,
        timeStyle: timeStyle.value,
      };
    } else {
      opts = {
        locale: locale.value,
        weekday: weekday.value,
        era: era.value,
        year: year.value,
        month: month.value,
        day: day.value,
        hour: hour.value,
        minute: minute.value,
        second: second.value,
        timeZoneName: timeZoneName.value,
      };
    }

    resetFormatting({
      store,
      column,
    });
    setFormatting({
      datatype: "date",
      store,
      column,
      opts,
    });
  };

  const radioClass = (value: string) =>
    cn({
      "btn btn-xs": true,
      "btn-outline": value === configMode.value,
    });

  return (
    <div class="flex flex-col gap-1">
      <LocaleSelector data={locale} />
      <div class="grid grid-cols-2 grid-rows-1 gap-1">
        <button
          type="button"
          onClick={() => {
            configMode.value = "style";
          }}
          class={radioClass("style")}
        >
          Style
        </button>
        <button
          type="button"
          onClick={() => {
            configMode.value = "manual";
          }}
          class={radioClass("manual")}
        >
          Manual
        </button>
      </div>

      {configMode.value === "style" && (
        <>
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text">Date Style</span>
            </label>
            <select
              class="select select-sm select-bordered"
              value={dateStyle.value}
              onChange={(e) => {
                dateStyle.value = (e.target as any).value;
              }}
            >
              <option value="full">Full</option>
              <option value="long">Long</option>
              <option value="medium">Medium</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text">Time Style</span>
            </label>
            <select
              class="select select-sm select-bordered"
              value={timeStyle.value}
              onChange={(e) => {
                timeStyle.value = (e.target as any).value;
              }}
            >
              <option value="full">Full</option>
              <option value="long">Long</option>
              <option value="medium">Medium</option>
              <option value="short">Short</option>
            </select>
          </div>
        </>
      )}
      {configMode.value === "manual" && (
        <div class="flex flex-col gap-2 mt-2">
          <select
            class="select select-sm select-bordered"
            value={weekday.value}
            onChange={(e) =>
              weekday.value = (e.target as any).value || undefined}
          >
            <option value="">Weekday</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
            <option value="narrow">Narrow</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={era.value}
            onChange={(e) => era.value = (e.target as any).value || undefined}
          >
            <option value="">Era</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
            <option value="narrow">Narrow</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={year.value}
            onChange={(e) => year.value = (e.target as any).value || undefined}
          >
            <option value="">Year</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={month.value}
            onChange={(e) => month.value = (e.target as any).value || undefined}
          >
            <option value="">Month</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
            <option value="narrow">Narrow</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={day.value}
            onChange={(e) => day.value = (e.target as any).value || undefined}
          >
            <option value="">Day</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={hour.value}
            onChange={(e) => hour.value = (e.target as any).value || undefined}
          >
            <option value="">Hour</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={minute.value}
            onChange={(e) =>
              minute.value = (e.target as any).value || undefined}
          >
            <option value="">Minute</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={second.value}
            onChange={(e) =>
              second.value = (e.target as any).value || undefined}
          >
            <option value="">Second</option>
            <option value="numeric">Numeric</option>
            <option value="2-digit">2-digit</option>
          </select>
          <select
            class="select select-sm select-bordered"
            value={timeZoneName.value}
            onChange={(e) =>
              timeZoneName.value = (e.target as any).value || undefined}
          >
            <option value="">Time Zone Name</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
            <option value="shortOffset">Short Offset</option>
            <option value="longOffset">Long Offset</option>
            <option value="shortGeneric">Short Generic</option>
            <option value="longGeneric">Long Generic</option>
          </select>
        </div>
      )}
      <button
        type="button"
        onClick={onApply}
        class="btn btn-sm w-full mt-5"
      >
        Apply
      </button>
      <button
        onClick={() => resetFormatting({ store, column })}
        type="button"
        class="btn btn-xs btn-ghost w-full mt-1"
      >
        Reset
      </button>
    </div>
  );
}
