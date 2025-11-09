import { Signal } from "@preact/signals";

const CURRENCY_CODES = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
  "MXN",
  "SGD",
  "HKD",
  "NOK",
  "KRW",
  "TRY",
  "RUB",
  "INR",
  "BRL",
  "ZAR",
];

const CURRENCIES = CURRENCY_CODES.map((code) => {
  try {
    const displayName = new Intl.DisplayNames([navigator.language], {
      type: "currency",
    });
    return { name: `${displayName.of(code)} (${code})`, value: code };
  } catch (e) {
    return { name: code, value: code };
  }
});

export interface CurrencySelectorProps {
  data: Signal<string>;
  className?: string;
}

export const CurrencySelector = (
  { data, className }: CurrencySelectorProps,
) => {
  return (
    <select
      onChange={(e) => data.value = e.target.value}
      defaultValue={data.value}
      className={"select select-sm " + className}
    >
      <option value={data.value} disabled>Select Currency</option>
      {CURRENCIES.map((currency) => (
        <option value={currency.value}>{currency.name}</option>
      ))}
    </select>
  );
};
