import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down-0-1.js";
import ArrowUpIcon from "lucide-react/dist/esm/icons/arrow-up-1-0.js";
import ArrowDownUpIcon from "lucide-react/dist/esm/icons/arrow-down-up.js";

import { TableStore } from "@/module/mod.ts";
import { cn } from "@/common/className.ts";

import { ColumnRendererCallback } from "@/module/types.ts";
import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { SORT_SET, SortSetCommand } from "../store.ts";
import { SortState } from "../types.ts";

interface RowSorterProps {
  column: string;
  store: TableStore;
}

export const RowSorter = ({ column, store }: RowSorterProps) => {
  const meta = store.state.fetcher.table_meta.value;
  if (!meta?.sortableAll && !meta?.sortableColumns?.includes(column)) {
    return null;
  }

  const isLoading = useSignal(false);
  const state = store.state.sorting.value ?? {};

  const sort = (state: SortState) => {
    store.dispatch<SortSetCommand>({
      type: SORT_SET,
      payload: state,
    });
    store.shouldReload();
  };

  const handler = useCallback(() => {
    const state = store.state.sorting.value;
    if (!state?.sort) {
      sort({
        column,
        sort: "asc",
      });
    }

    if (state.sort === "asc") {
      sort({
        column,
        sort: "desc",
      });
    }

    if (state.sort === "desc") {
      sort({});
    }

    isLoading.value = true;

    const endIsLoading = () => {
      if (!store.state.fetcher.loading.value) {
        isLoading.value = false;
        return;
      }
      setTimeout(endIsLoading, 300);
    };
    setTimeout(endIsLoading, 300);
  }, []);

  return (
    <button
      data-testid={column + "-sorter"}
      key={state?.column}
      type="button"
      class={cn({
        "vt-sorter": true,
        enabled: state?.column === column,
        "vt-loading": isLoading.value,
      })}
      onClick={handler}
    >
      {state?.column === column
        ? (
          state?.sort === "asc" ? <ArrowDownIcon /> : <ArrowUpIcon />
        )
        : <ArrowDownUpIcon />}
    </button>
  );
};

export const headerRenderCallback: ColumnRendererCallback = ({
  column,
  store,
}) => {
  return <RowSorter column={column} store={store} />;
};
