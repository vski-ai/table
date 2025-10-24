import { Signal } from "@preact/signals";
import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down-0-1.js";
import ArrowUpIcon from "lucide-react/dist/esm/icons/arrow-up-1-0.js";
import ArrowDownUpIcon from "lucide-react/dist/esm/icons/arrow-down-up.js";

export type SortState = {
  column: string;
  sort: "asc" | "desc";
};

interface ColumnSorterProps {
  className?: string;
  activeClassName?: string;
  column: string;
  state: Signal<SortState>;
  onChange?: (state: SortState) => void;
}

export const ColumnSorter = ({
  column,
  state,
  className = "btn btn-xs btn-ghost w-8 h-8",
  activeClassName = "btn-active",
  onChange,
}: ColumnSorterProps) => {
  return (
    <button
      key={state?.value.column}
      type="button"
      class={`${className} ${
        state?.value.column === column && activeClassName
      }`}
      onClick={() => {
        if (!state?.value) {
          return;
        }
        if (state.value.column === column) {
          state.value = {
            column,
            sort: state.value.sort === "asc" ? "desc" : "asc",
          };
        } else {
          state.value = {
            column,
            sort: "asc",
          };
        }
        onChange?.(state.value);
      }}
    >
      {state?.value.column === column
        ? state?.value.sort === "asc" ? <ArrowDownIcon /> : <ArrowUpIcon />
        : <ArrowDownUpIcon />}
    </button>
  );
};
