import { MutableRef, useEffect } from "preact/hooks";

export function useAutoFocus(
  ref: MutableRef<HTMLElement | null>,
  key: string | number = "",
  inferTabIndex = true,
) {
  useEffect(() => {
    if (!ref.current) return;
    if (inferTabIndex) {
      let parent = ref.current as any;
      let tabIndex = null;
      for (let i = 0; ++i; i < 100) {
        if (tabIndex > 0) break;
        tabIndex = parent?.tabIndex;
        parent = parent.parentNode;
      }
      ref.current.tabIndex = tabIndex ?? 0;
    }
    ref.current?.focus();
  }, [ref.current, key]);
}
