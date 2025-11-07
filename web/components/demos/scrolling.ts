import { TableStore } from "@/store/types.ts";
import { delay, end, start } from "./common.ts";
import { RefObject } from "preact";

async function scrollX(element: HTMLElement, to: number, duration = 1000) {
  const start = element.scrollLeft;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const animateScroll = async () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollLeft = val;
    if (currentTime < duration) {
      await delay(increment);
      await animateScroll();
    }
  };

  await animateScroll();
}

async function scrollY(element: HTMLElement, to: number, duration = 1000) {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const animateScroll = async () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      await delay(increment);
      await animateScroll();
    }
  };

  await animateScroll();
}

export async function virtualScroll(scrollContainer: RefObject<HTMLElement>) {
  start();
  scrollContainer.current!.scrollTop = 20000;
  await delay(1000);
  await scrollY(scrollContainer.current!, 16200, 800);
  await delay(1000);
  await scrollY(scrollContainer.current!, 0, 1000);
  end();
}

export async function stickyColumns(
  store: TableStore,
  scrollContainer: RefObject<HTMLElement>,
) {
  if (!scrollContainer.current) {
    return;
  }
  start();

  // Make first name sticky
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    "First Name": "left",
  };
  await delay(500);

  // Scroll right
  await scrollX(scrollContainer.current, 1000, 2000);
  await delay(500);

  // Scroll left
  await scrollX(scrollContainer.current, 0, 2000);
  await delay(500);

  // Remove stickiness
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    "First Name": false,
  };
  await delay(500);

  end();
}

export async function stickyRightColumns(
  store: TableStore,
  scrollContainer: RefObject<HTMLElement>,
) {
  if (!scrollContainer.current) {
    return;
  }
  start();

  // Make "City" column sticky to the right
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    "Country": "right",
  };

  // Scroll to the end
  const maxScroll = scrollContainer.current.scrollWidth -
    scrollContainer.current.clientWidth;
  await scrollX(scrollContainer.current, maxScroll, 2000);
  await delay(500);

  await delay(500);

  // Scroll left
  await scrollX(scrollContainer.current, 0, 2000);
  await delay(500);

  // Remove stickiness
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    "Country": false,
  };
  await delay(500);

  end();
}
