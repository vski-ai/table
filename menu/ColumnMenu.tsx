import { Signal, useSignal } from "@preact/signals";
import { XYModal } from "./XYModal.tsx";
import { Formatting } from "@/format/index.tsx";
import MenuIcon from "lucide-react/dist/esm/icons/sliders-horizontal.js";

export interface MenuProps {
  column: string;
  openSignal?: Signal<boolean>;
  store: ColumnMenuStore;
}

export interface ColumnMenuStore {
  cellFormatting: Signal<Record<string, any>>;
}

export const ColumnMenu = ({
  column,
  openSignal = useSignal(false),
  store,
}: MenuProps) => {
  const target = `#column-header-${column}`;
  return (
    <>
      <button
        type="button"
        class="btn btn-sm btn-ghost w-8 h-8 p-0"
        onClick={() => {
          openSignal.value = true;
        }}
      >
        <MenuIcon style={{ width: 12 }} />
      </button>
      <XYModal
        target={target}
        openSignal={openSignal}
        margins={{
          top: 72,
        }}
      >
        <div tabIndex={1} className="tabs-lift tabs w-full min-w-full">
          <label className="tab">
            <input
              type="radio"
              name="my_tabs_7"
              defaultChecked
            />
            Filtering
          </label>
          <div className="start-0 tab-content min-h-100 max-w-full border-base-300 bg-base-100 p-6">
            Tab content 1
          </div>
          <label className="tab">
            <input
              type="radio"
              name="my_tabs_7"
            />
            Formatting
          </label>
          <div className=" start-0 tab-content max-w-full border-base-300 bg-base-100 p-6">
            <Formatting
              column={column}
              formatting={store.cellFormatting}
            />
          </div>
        </div>
      </XYModal>
    </>
  );
};
