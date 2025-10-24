import { Signal } from "@preact/signals";
import { NumberFormatting as NumberFormattingType } from "./types.ts";

export const NumberFormatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const numberFormatting = formatting.value[column]?.number || {};

  const onNumberChange = (newNumberFormatting: NumberFormattingType) => {
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        number: newNumberFormatting,
      },
    };
  };

  return (
    <div class="collapse p-0 collapse-arrow border border-base-300 bg-base-200 transition-none">
      <input type="checkbox" />
      <div class="collapse-title font-bold">
        Number Formatting
      </div>
      <div class="collapse-content flex flex-col gap-2 transition-none">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Locale</span>
          </label>
          <input
            type="text"
            placeholder="e.g., en-US"
            class="input input-bordered"
            value={numberFormatting.locale ?? ""}
            onInput={(e) =>
              onNumberChange({
                ...numberFormatting,
                locale: e.currentTarget.value,
              })}
          />
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
    </div>
  );
};
