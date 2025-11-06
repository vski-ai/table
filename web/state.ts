import { effect, signal } from "@preact/signals";

type UI = {
  theme?: string;
  dense?: string;
  aside?: string;
};

export const ui = signal<UI>(getState("$ui"));

effect(() => {
  saveState("$ui", ui.value);
  document.body.dataset.theme = ui.value.theme || "dark";
  document.body.dataset.dense = ui.value.dense || "0";
  document.body.dataset.aside = ui.value.aside || "0";
});

export function getState<T>(x: string): T {
  return JSON.parse(localStorage.getItem(x) ?? "{}");
}

export function saveState<T>(x: string, s: T) {
  localStorage.setItem(x, JSON.stringify(s));
}
