import { useSignal } from "@preact/signals";
import { cn } from "@/common/className.ts";
import { LocaleSelector } from "../components/LocaleSelector.tsx";
import { CurrencySelector } from "./CurrencySelector.tsx";
import { UnitSelector } from "./UnitSelector.tsx";
import { MenuContext } from "@/ctxmenu/types.ts";
import { resetFormatting, setFormatting } from "../mutations.ts";

import HashIcon from "lucide-react/dist/esm/icons/hash.js";
import DollarIcon from "lucide-react/dist/esm/icons/dollar-sign.js";
import UnitIcon from "lucide-react/dist/esm/icons/drafting-compass.js";

export function Settings({ store, column }: MenuContext) {
  const current = useSignal<"number" | "unit" | "currency">("number");
  const locale = useSignal(navigator.language);
  const currency = useSignal("");
  const unit = useSignal("");
  const currenyDisplay = useSignal<"symbol" | "narrowSymbol" | "code" | "name">(
    "symbol",
  );
  const unitDisplay = useSignal<"short" | "long" | "narrow">("short");
  const digits = useSignal(2);
  const error = useSignal<any>({});

  const radioClass = (value: string) =>
    cn({
      "btn btn-xs": true,
      "btn-outline": value === current.value,
    });

  const onApply = () => {
    error.value = {};
    const opts: Intl.NumberFormatOptions & { locale: string } = {
      minimumFractionDigits: digits.value,
      maximumFractionDigits: digits.value,
      locale: locale.value,
    };

    if (current.value === "currency") {
      if (!currency.value) {
        error.value = {
          currency: true,
        };
        return;
      }
      opts.style = "currency";
      opts.currencyDisplay = currenyDisplay.value;
      opts.currency = currency.value;
    }
    if (current.value === "unit") {
      if (!unit.value) {
        error.value = {
          unit: true,
        };
        return;
      }
      opts.style = "unit";
      opts.unitDisplay = unitDisplay.value;
      opts.unit = unit.value;
    }

    resetFormatting({
      store,
      column,
    });
    setFormatting({
      datatype: current.value,
      store,
      column,
      opts,
    });
  };

  return (
    <div class="flex flex-col gap-1">
      <LocaleSelector data={locale} />
      <div className="grid grid-cols-3 grid-rows-1 gap-1">
        <button
          type="button"
          onClick={() => {
            current.value = "number";
          }}
          class={radioClass("number")}
        >
          <HashIcon className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => {
            current.value = "currency";
          }}
          class={radioClass("currency")}
        >
          <DollarIcon className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => {
            current.value = "unit";
          }}
          class={radioClass("unit")}
        >
          <UnitIcon className="w-3 h-3" />
        </button>
      </div>

      {current.value === "currency"
        ? (
          <div class="grid grid-cols-2 grid-rows-1 gap-1 mt-2">
            <CurrencySelector
              className={error.value?.currency ? "input-warning" : ""}
              data={currency}
            />
            <select
              class="select select-sm select-bordered"
              value={currenyDisplay.value}
              onChange={(e) => {
                currenyDisplay.value = (e.target as any).value;
              }}
            >
              <option value="symbol">Symbol</option>
              <option value="narrowSymbol">Narrow Symbol</option>
              <option value="code">Code</option>
              <option value="name">Name</option>
            </select>
          </div>
        )
        : null}

      {current.value === "unit" && (
        <div class="grid grid-cols-2 grid-rows-1 gap-1 mt-2">
          <UnitSelector
            className={error.value?.unit ? "input-warning" : ""}
            data={unit}
          />
          <select
            class="select select-sm select-bordered"
            value={unitDisplay.value}
            onChange={(e) => {
              unitDisplay.value = (e.target as any).value;
            }}
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="narrow">Narrow</option>
          </select>
        </div>
      )}

      <div class="form-control w-full mt-3">
        <label class="label">
          <span class="label-text">Fraction Digits</span>
        </label>
        <input
          type="number"
          class="input input-sm input-bordered"
          value={digits.value}
          min={0}
          step={1}
          onInput={(e) => {
            digits.value = Number((e.target as any).value);
          }}
        />
      </div>
      <button
        type="button"
        onClick={onApply}
        className="btn btn-sm w-full mt-5"
      >
        Apply
      </button>
      <button
        onClick={() => resetFormatting({ store, column })}
        type="button"
        className="btn btn-xs btn-ghost w-full mt-1"
      >
        Reset
      </button>
    </div>
  );
}
