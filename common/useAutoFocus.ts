import { MutableRef, useEffect } from "preact/hooks";

export function useAutoFocus(
  ref: MutableRef<HTMLElement | null>,
  inferTabIndex = true,
) {
  useEffect(() => {
    if (!ref.current) return;
    if (inferTabIndex) {
      const tabIndex = ((ref.current?.parentNode as HTMLDivElement)?.closest(
        "[tabindex]",
      ) as HTMLDivElement)?.tabIndex ?? 0;
      ref.current.tabIndex = tabIndex;
    }
    ref.current.focus();
  }, [ref.current]);
}
