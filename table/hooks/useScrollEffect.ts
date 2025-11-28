import { Store } from "@xmod/mod.ts";
import { useEffect } from "preact/hooks";

export function useScrollEffect(
  { store, enabled }: { store: Store; enabled: boolean },
) {
  useEffect(() => {
    if (!enabled) return;
    const ref = store.scrollContainerRef.current;
    let lastPos = ref.scrollTop;
    const scroll = () => {
      if (Math.abs(lastPos - ref.scrollTop) >= ref.clientHeight) {
        ref.classList.add("vt-scrolling");
      }
    };
    const scrollend = () => {
      ref.classList.remove("vt-scrolling");
      lastPos = ref.scrollTop;
    };

    ref.addEventListener("scroll", scroll);
    ref.addEventListener("scrollend", scrollend);
    return () => {
      ref.removeEventListener("scroll", scroll);
      ref.removeEventListener("scrollend", scrollend);
    };
  });
}
