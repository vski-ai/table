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
