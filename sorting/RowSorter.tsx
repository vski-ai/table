import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down-0-1.js";
import ArrowUpIcon from "lucide-react/dist/esm/icons/arrow-up-1-0.js";
import ArrowDownUpIcon from "lucide-react/dist/esm/icons/arrow-down-up.js";
import { SorterStore, SortState } from "./types.ts";

interface RowSorterProps {
  className?: string;
  activeClassName?: string;
  column: string;
  store: SorterStore;
  leafId?: string;
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
    ? store.sorting.value
    : (store.leafSorting.value[leafId] ?? { column: "", sort: "" });

  const setState = (state: SortState) => {
    if (leafId) {
      store.leafSorting.value = {
        ...store.leafSorting.value,
        [leafId]: state,
      };
    } else {
      store.sorting.value = state;
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
          setState({
            column,
            sort: state.sort === "asc" ? "desc" : "asc",
          });
        } else {
          setState({
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
