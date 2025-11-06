import { Signal, signal } from "@preact/signals";
import { useEffect, useMemo, useState } from "preact/hooks";

const LOCALE_CODES = [
  "en-US",
  "en-GB",
  "fr-FR",
  "de-DE",
  "es-ES",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "pt-BR",
  "ru-RU",
  "zh-CN",
  "ar-SA",
  "ar-EG",
  "bn-BD",
  "bn-IN",
  "cs-CZ",
  "da-DK",
  "de-AT",
  "de-CH",
  "el-GR",
  "en-AU",
  "en-CA",
  "en-IN",
  "en-NZ",
  "en-ZA",
  "es-MX",
  "fi-FI",
  "fr-CA",
  "fr-CH",
  "he-IL",
  "hi-IN",
  "hu-HU",
  "id-ID",
  "it-CH",
  "nl-BE",
  "nl-NL",
  "no-NO",
  "pl-PL",
  "pt-PT",
  "ro-RO",
  "sk-SK",
  "sv-SE",
  "ta-IN",
  "ta-LK",
  "th-TH",
  "tr-TR",
  "uk-UA",
  "vi-VN",
];

const LOCALES = LOCALE_CODES.map((code) => {
  try {
    const displayName = new Intl.DisplayNames([code], { type: "language" });
    return { name: `${displayName.of(code)} (${code})`, value: code };
  } catch (e) {
    return { name: code, value: code };
  }
});

export interface LocaleSelectorProps {
  selectedLocale: Signal<string>;
}

export const LocaleSelector = ({ selectedLocale }: LocaleSelectorProps) => {
  const [filter, setFilter] = useState("");

  const filteredLocales = useMemo(() => {
    return LOCALES.filter((locale) =>
      locale.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  useEffect(() => {
    if (!selectedLocale.value) {
      selectedLocale.value = navigator.language;
    }
  }, []);

  return (
    <div class="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search locales"
        class="input input-bordered w-full"
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
      <div class="max-h-60 overflow-y-auto">
        <ul class="menu menu-sm">
          {filteredLocales.map((locale) => (
            <li
              key={locale.value}
              onClick={() => selectedLocale.value = locale.value}
              class={`rounded-lg ${
                selectedLocale.value === locale.value ? "bg-base-200" : ""
              }`}
            >
              <a>{locale.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
