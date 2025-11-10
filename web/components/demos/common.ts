export const start = () => {
  document.querySelectorAll("td, th, tr")?.forEach((element) => {
    element.classList.add("transition-all");
    element.classList.add("duration-1000");
    element.classList.add("pointer-events-none");
  });
};

export const delay = (n = 1000) => new Promise((r) => setTimeout(r, n));

export const end = () => {
  document.querySelectorAll("td, th, tr")?.forEach((element) => {
    element.classList.remove("transition-all");
    element.classList.remove("duration-1000");
    element.classList.remove("pointer-events-none");
  });
};

export async function scrollX(
  element: HTMLElement,
  to: number,
  duration = 1000,
) {
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

export async function scrollY(
  element: HTMLElement,
  to: number,
  duration = 1000,
) {
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
