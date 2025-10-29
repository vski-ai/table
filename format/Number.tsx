import { memo } from "preact/compat";
import { useCallback, useEffect } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
import { NumberFormatting as NumberFormattingType } from "./types.ts";
import { LocaleSelector } from "@/menu/LocaleSelector.tsx";

export const NumberFormatting = memo((
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const numberFormatting = formatting.value[column]?.number || {};
  const selectedLocale = useSignal(numberFormatting.locale);

  const onNumberChange = useCallback(
    (newNumberFormatting: NumberFormattingType) => {
      formatting.value = {
        ...formatting.value,
        [column]: {
          ...formatting.value[column],
          number: newNumberFormatting,
        },
      };
    },
    [formatting, column],
  );

  useEffect(() => {
    onNumberChange({
      ...numberFormatting,
      locale: selectedLocale.value,
    });
  }, [onNumberChange, numberFormatting, selectedLocale.value]);

  return (
    <div class="flex flex-col gap-2 transition-none py-6">
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Locale</span>
        </label>
        <LocaleSelector selectedLocale={selectedLocale} />
      </div>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Style</span>
        </label>
        <select
          class="select select-bordered"
          value={numberFormatting.style ?? "decimal"}
          onChange={(e) =>
            onNumberChange({
              ...numberFormatting,
              style: e.currentTarget.value as any,
            })}
        >
          <option value="decimal">Decimal</option>
          <option value="currency">Currency</option>
          <option value="percent">Percent</option>
          <option value="unit">Unit</option>
        </select>
      </div>
      {numberFormatting.style === "currency" && (
        <>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Currency</span>
            </label>
            <input
              type="text"
              placeholder="e.g., USD"
              class="input input-bordered"
              value={numberFormatting.currency ?? ""}
              onInput={(e) =>
                onNumberChange({
                  ...numberFormatting,
                  currency: e.currentTarget.value,
                })}
            />
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Currency Display</span>
            </label>
            <select
              class="select select-bordered"
              value={numberFormatting.currencyDisplay ?? "symbol"}
              onChange={(e) =>
                onNumberChange({
                  ...numberFormatting,
                  currencyDisplay: e.currentTarget.value as any,
                })}
            >
              <option value="symbol">Symbol</option>
              <option value="narrowSymbol">Narrow Symbol</option>
              <option value="code">Code</option>
              <option value="name">Name</option>
            </select>
          </div>
        </>
      )}
      {numberFormatting.style === "unit" && (
        <>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Unit</span>
            </label>
            <input
              type="text"
              placeholder="e.g., liter"
              class="input input-bordered"
              value={numberFormatting.unit ?? ""}
              onInput={(e) =>
                onNumberChange({
                  ...numberFormatting,
                  unit: e.currentTarget.value,
                })}
            />
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Unit Display</span>
            </label>
            <select
              class="select select-bordered"
              value={numberFormatting.unitDisplay ?? "short"}
              onChange={(e) =>
                onNumberChange({
                  ...numberFormatting,
                  unitDisplay: e.currentTarget.value as any,
                })}
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="narrow">Narrow</option>
            </select>
          </div>
        </>
      )}
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Min Fraction Digits</span>
        </label>
        <input
          type="number"
          class="input input-bordered"
          value={numberFormatting.minimumFractionDigits ?? ""}
          onInput={(e) =>
            onNumberChange({
              ...numberFormatting,
              minimumFractionDigits: e.currentTarget.valueAsNumber,
            })}
        />
      </div>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Max Fraction Digits</span>
        </label>
        <input
          type="number"
          class="input input-bordered"
          value={numberFormatting.maximumFractionDigits ?? ""}
          onInput={(e) =>
            onNumberChange({
              ...numberFormatting,
              maximumFractionDigits: e.currentTarget.valueAsNumber,
            })}
        />
      </div>
    </div>
  );
});
