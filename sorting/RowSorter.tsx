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
  leafId?: string | number;
  onChange?: (state: SortState) => void;
  style?: any;
}

export const RowSorter = ({
  column,
  store,
  className = "btn btn-xs btn-ghost w-8 h-8",
  activeClassName = "btn-active",
  leafId,
  style,
  onChange,
}: RowSorterProps) => {
  const state = !leafId
    ? store.state.sorting.value
    : (store.state.leafSorting.value[leafId] ?? { column: "", sort: "" });

  const sort = (state: SortState) => {
    if (leafId) {
      store.state.leafSorting.value = {
        ...store.state.leafSorting.value,
        [leafId]: state,
      };
    } else {
      store.dispatch({
        type: CommandType.SORT_SET,
        payload: state,
      });
    }
  };

  const wh = {
    width: style?.width,
    height: style?.height,
  };

  return (
    <button
      key={state?.column}
      type="button"
      style={style}
      class={`${className} ${state?.column === column && activeClassName}`}
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
          ? <ArrowDownIcon style={wh} />
          : <ArrowUpIcon style={wh} />
        : <ArrowDownUpIcon style={wh} />}
    </button>
  );
};

export const headerRenderCallback: ColumnRendererCallback = ({
  column,
  store,
}) => {
  return <RowSorter column={column} store={store} />;
};
