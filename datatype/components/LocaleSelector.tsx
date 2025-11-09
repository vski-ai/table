import { Signal } from "@preact/signals";

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
    const displayName = new Intl.DisplayNames([navigator.language], {
      type: "language",
    });
    return { name: `${displayName.of(code)} (${code})`, value: code };
  } catch (e) {
    return { name: code, value: code };
  }
});

export interface LocaleSelectorProps {
  data: Signal<string>;
}

export const LocaleSelector = ({ data }: LocaleSelectorProps) => {
  const displayName = new Intl.DisplayNames([navigator.language], {
    type: "language",
  });
  return (
    <select
      onChange={(e) => data.value = e.target.value}
      defaultValue={data.value}
      className="select select-sm"
    >
      <option value={data.value} disabled>
        {displayName.of(navigator.language)} ({navigator.language})
      </option>
      {LOCALES.map((locale) => (
        <option value={locale.value}>{locale.name}</option>
      ))}
    </select>
  );
};
