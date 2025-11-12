import { TableStore } from "@/module/types.ts";
import { MutableRef, useEffect } from "preact/hooks";

export function useAutoFocus(
  ref: MutableRef<HTMLElement | null>,
  key: string | number = "",
  store: TableStore,
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
        parent = parent?.parentNode;
        if (!parent) break;
      }
      ref.current.tabIndex = tabIndex ?? 0;
    }
    ref.current?.focus();
    const onScroll = () => {
      store.state.cellEditing.value = {};
    };
    store.scrollContainerRef.current?.addEventListener("scroll", onScroll);
    return () => {
      store.scrollContainerRef.current?.removeEventListener("scroll", onScroll);
    };
  }, [ref.current, key]);
}
