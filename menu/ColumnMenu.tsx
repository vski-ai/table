import { Signal } from "@preact/signals";
import { XYModal } from "@/popup/XYModal.tsx";
import { Formatting } from "../format/index.tsx";

export interface ColumnMenuProps {
  column: string;
  openSignal: Signal<boolean>;
  store: ColumnMenuStore;
}

export interface ColumnMenuStore {
  formatting: Signal<Record<string, Record<string, string>>>;
}

export const ColumnMenu = ({
  column,
  openSignal,
  store,
}: ColumnMenuProps) => {
  const target = `#column-header-${column}`;
  console.log(store.formatting.value);
  return (
    <XYModal
      target={target}
      openSignal={openSignal}
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
            formatting={store.formatting}
          />
        </div>
      </div>
    </XYModal>
  );
};
