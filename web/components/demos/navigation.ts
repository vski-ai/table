import { delay } from "./common.ts";

async function focusCell(selector: string) {
  await delay(100);
  const cell = document.querySelector(selector) as HTMLElement;
  if (cell) {
    cell.focus();
    await delay(500);
  }
}

async function pressKey(key: string, shift = false) {
  const activeElement = document.activeElement;
  if (activeElement) {
    activeElement.dispatchEvent(
      new KeyboardEvent("keydown", { key, shiftKey: shift, bubbles: true }),
    );
    await delay(200);
  }
}

export async function navigation() {
  // Start at the third cell of the third row
  const startCellSelector = `tr[data-index="2"] td[tabindex="3"]`;
  console.log(startCellSelector);
  await focusCell(startCellSelector);

  // Press right arrow 3 times
  await pressKey("ArrowRight");
  await pressKey("ArrowRight");
  await pressKey("ArrowRight");

  // Press down arrow 3 times
  await pressKey("ArrowDown");
  await pressKey("ArrowDown");
  await pressKey("ArrowDown");

  // Press left arrow 3 times
  await pressKey("ArrowLeft");
  await pressKey("ArrowLeft");
  await pressKey("ArrowLeft");
}

export async function multiselect() {
  // Start at the third cell of the third row
  const startCellSelector = `tr[data-index="2"] td[tabindex="3"]`;
  console.log(startCellSelector);
  await focusCell(startCellSelector);

  // Press right arrow 3 times
  await pressKey("Shift");
  await pressKey("ArrowRight");
  await pressKey("Shift");
  await pressKey("ArrowRight");
  await pressKey("Shift");
  await pressKey("ArrowRight");

  await pressKey("Shift");
  await pressKey("ArrowDown");

  // Press left arrow 3 times
  await pressKey("Shift");
  await pressKey("ArrowLeft");
  await pressKey("Shift");
  await pressKey("ArrowLeft");
  await pressKey("Shift");
  await pressKey("ArrowLeft");
  await pressKey("Shift");
  await pressKey("ArrowUp", false);

  await delay(300);
  await pressKey("Escape", false);
}
