import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { TableStore } from "@/store/types.ts";
import { Row } from "@/table/types.ts";

export const useData = (
  onDataLoad: (options: {
    offset: number;
    limit: number;
    store: TableStore;
  }) => Promise<{ rows: Row[]; total: number }>,
  store: TableStore,
  limit = 50,
) => {
  const data = useSignal<Row[]>([]);
  const total = useSignal(0);
  const timeoutRef = useRef<number | null>(null);

  const load = (start: number, end: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (start > total.value && total.value > 0) {
        return;
      }

      let shouldLoad = false;
      for (let i = start; i < end; i++) {
        if (!data.value[i]) {
          shouldLoad = true;
          break;
        }
      }

      if (!shouldLoad) {
        return;
      }

      store.state.loading.value = true;
      const { rows, total: newTotal } = await onDataLoad({
        offset: start,
        limit: end - start,
        store,
      });

      if (total.value === 0) {
        total.value = newTotal;
        data.value = Array(newTotal).fill(null);
      }

      const newData = [...data.value];
      for (let i = 0; i < rows.length; i++) {
        newData[start + i] = rows[i];
      }
      data.value = newData;

      store.state.loading.value = false;
    }, 200);
  };

  useEffect(() => {
    load(0, limit);
  }, []);

  return { data, total, load };
};
