import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down-0-1.js";
import ArrowUpIcon from "lucide-react/dist/esm/icons/arrow-up-1-0.js";
import ArrowDownUpIcon from "lucide-react/dist/esm/icons/arrow-down-up.js";

import { TableStore } from "@/store/mod.ts";
import { SortState } from "./types.ts";
import { ColumnRendererCallback } from "@/plugin/types.ts";
import { CommandType } from "./store.ts";

interface RowSorterProps {
  className?: string;
  activeClassName?: string;
  column: string;
  store: TableStore;
  onChange?: (state: SortState) => void;
}

export const RowSorter = ({
  column,
  store,
  onChange,
}: RowSorterProps) => {
  const meta = store.state.tableMeta.value;
  if (!meta?.sortableAll && !meta?.sortableColumns?.includes(column)) {
    return null;
  }

  const state = store.state.sorting.value ?? { column: "", sort: "" };

  const sort = (state: SortState) => {
    store.dispatch({
      type: CommandType.SORT_SET,
      payload: state,
    });
    store.shouldReload();
  };

  return (
    <button
      key={state?.column}
      type="button"
      class={[
        "btn btn-xs btn-ghost w-8 h-8",
        state?.column === column && "btn-active",
      ].join(" ")}
      onClick={() => {
        if (!state) {
          return;
        }
        if (state.column === column) {
          sort({
            column,
            sort: state.sort === "asc" ? "desc" : "asc",
          });
        } else {
          sort({
            column,
            sort: "asc",
          });
        }
        onChange?.(state);
      }}
    >
      {state?.column === column
        ? state?.sort === "asc" ? <ArrowDownIcon /> : <ArrowUpIcon />
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
