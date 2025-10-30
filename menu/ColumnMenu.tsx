import { Signal } from "@preact/signals";
import { Formatting } from "@/format/index.tsx";
import { CommandType, TableStore } from "@/store/mod.ts";
import { StickyPosition } from "@/store/types.ts";

export interface MenuProps {
  column: string;
  store: TableStore;
}

export const ColumnMenu = ({
  column,
  store,
}: MenuProps) => {
  return (
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
          formatting={store.state.cellFormatting}
        />
      </div>
      <div class="p-4">
        <label class="label">
          <span class="label-text">Sticky Position</span>
        </label>
        <select
          class="select select-bordered w-full max-w-xs"
          value={store.state.stickyColumns.value[column] || "false"}
          onChange={(e) => {
            const position = (e.target as HTMLSelectElement).value as
              | StickyPosition
              | "false";
            store.dispatch({
              type: CommandType.COLUMN_STICK_SET,
              payload: {
                column,
                position: position === "false" ? false : position,
              },
            });
          }}
        >
          <option value="false">None</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
};
