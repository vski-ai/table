import { TableStore } from "@/module/mod.ts";
import { SortState } from "@/sorting/types.ts";
import { RowData } from "@/row/types.ts";
import { CellRendererCallback } from "@/module/mod.ts";
import { LeafSortCommand } from "../store.ts";

import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down-0-1.js";
import ArrowUpIcon from "lucide-react/dist/esm/icons/arrow-up-1-0.js";
import ArrowDownUpIcon from "lucide-react/dist/esm/icons/arrow-down-up.js";

interface RowSorterProps {
  className?: string;
  activeClassName?: string;
  column: string;
  store: TableStore;
  row: RowData;
  onChange?: (state: SortState) => void;
}

export const GroupSorter = ({
  column,
  store,
  row,
  onChange,
}: RowSorterProps) => {
  const meta = store.state.fetcher.table_meta.value;
  if (
    !meta.sortableGroupLevelAll &&
    !meta?.sortableGroupLevelColumns?.[row.$group_level ?? 0]
      .includes(column)
  ) {
    return null;
  }

  const state = store.state.groupSorting.value[row.id] ??
    { column: "", sort: "" };

  const sort = (state: SortState) => {
    store.dispatch<LeafSortCommand>({
      type: "LEAF_SORT_SET",
      payload: {
        [row.id]: state,
      },
    });
    store.shouldReload();
  };

  return (
    <button
      key={state?.column}
      type="button"
      class={[
        "btn btn-sm btn-circle w-4 h-4 p-0 opacity-50 hover:opacity-100 transition-opacity",
        state?.column === column && "btn-active opacity-80",
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
        ? state?.sort === "asc"
          ? <ArrowDownIcon className="w-2" />
          : <ArrowUpIcon className="w-2" />
        : <ArrowDownUpIcon className="w-2" />}
    </button>
  );
};

export const cellSuffixRender: CellRendererCallback = ({
  column,
  row,
  store,
}) => {
  return <GroupSorter column={column} row={row} store={store} />;
};
