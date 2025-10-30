import { useEffect } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { RefObject } from "preact/compat";

interface LoadMoreEffectProps {
  store: TableStore;
  onLoadMore?: () => void;
  ref: RefObject<HTMLDivElement>;
}

export function useLoadMoreEffect({
  store,
  onLoadMore,
  ref,
}: LoadMoreEffectProps) {
  useEffect(() => {
    if (!onLoadMore) return;

    const loadMoreEl = ref.current;
    const loadMoreObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !store.state.loading.value) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 },
    );

    if (loadMoreEl) {
      loadMoreObserver.observe(loadMoreEl);
    }

    return () => {
      if (loadMoreEl) {
        loadMoreObserver.unobserve(loadMoreEl);
      }
    };
  }, [onLoadMore, store.state.loading.value]);
}
