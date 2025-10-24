import {
  ColumnMenu,
  ColumnSelector,
  ColumnSorter,
  DynamicTable,
  GroupingSelector,
  SortState,
} from "@/table/mod.ts";

import { GeneralFormatting } from "@/format/General.tsx";

import { useSignal } from "@preact/signals";
import { useMemo, useRef } from "preact/hooks";
import { XYModal } from "@/popup/XYModal.tsx";

import GridIcon from "lucide-react/dist/esm/icons/grid-2x2-plus.js";
import GroupIcon from "lucide-react/dist/esm/icons/group.js";

import { generateGroupData } from "./mock/groupable-table.ts";

export const BasicTable = () => {
  const isReserved = (col: string) =>
    [
      "$group_by",
      "$group_level",
      "$parent_id",
      "$is_group_root",
      "name",
    ].includes(col);
  const data = useMemo(() => generateGroupData(), []);
  const columns = Object.keys(data?.[0] ?? {}).filter((c) => !isReserved(c));
  const allColumns = useSignal<string[]>(columns);
  const selectedColumns = useSignal<string[]>(columns?.slice(0, 5));
  const selectedGroups = useSignal<string[]>([]);
  const parent = useRef<HTMLDivElement>(null);
  const sortState = useSignal<SortState>({
    column: "timestamp",
    sort: "asc",
  });
  const selected = useSignal<any[]>([]);
  const expanded = useSignal<any>({});
  const formatting = useSignal<any>({});
  const groupStates = useSignal<Record<string, boolean>>({});

  const onColumnDrop = (draggedId: string, targetId: string) => {
    const newColumns = [...selectedColumns.value];
    const draggedIndex = newColumns.indexOf(draggedId);
    const targetIndex = newColumns.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    selectedColumns.value = newColumns;
  };

  const columnMenuOpenSignal = useSignal(false);
  const columnMenuTarget = useSignal("");

  return (
    <div ref={parent}>
      <div>
        <XYModal
          target={columnMenuTarget.value}
          openSignal={columnMenuOpenSignal}
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
              Tab content 2
            </div>
          </div>
        </XYModal>
      </div>
      <div className="fixed z-50 bottom-2 right-6 flex flex-col gap-2">
        <div className="dropdown dropdown-top dropdown-end">
          <button
            tabIndex={0}
            type="button"
            className="btn btn-md btn-primary transition-opacity opacity-40 hover:opacity-100 focus:opacity-100"
          >
            <GroupIcon />
            <span class="badge badge-xs">{selectedGroups.value.length}</span>
          </button>
          <div class="dropdown-content z-100 mb-2">
            <GroupingSelector
              allColumns={allColumns.value}
              selectedGroups={selectedGroups}
            />
          </div>
        </div>
      </div>
      <DynamicTable
        data={data}
        columns={selectedColumns.value}
        cellFormatting={formatting}
        onColumnDrop={onColumnDrop}
        groupStates={groupStates}
        selectedRows={selected}
        // expandedRows={expanded}
        // renderExpandedRow={(row) => {
        //   return <p>Hello World!</p>;
        // }}
        columnAction={(column: string) => (
          <ColumnSorter
            key={sortState.value.column}
            column={column}
            state={sortState}
            onChange={(s) => {
              console.log("needs update");
            }}
          />
        )}
        columnExtensions={(column: string) => {
          const activeTab = useSignal("general");
          return (
            <>
              <button
                onClick={() => {
                  columnMenuTarget.value = `#column-header-${column}`;
                  columnMenuOpenSignal.value = true;
                }}
              >
                0
              </button>

              <ColumnMenu>
                <div class="menu card bg-base-100 w-100 border">
                  <div class="tabs">
                    <a
                      tabIndex={1}
                      class={`tab tab-lifted ${
                        activeTab.value === "general" ? "tab-active" : ""
                      }`}
                      onClick={() => activeTab.value = "general"}
                    >
                      General
                    </a>
                  </div>

                  <div class="p-2">
                    {activeTab.value === "general" && (
                      <GeneralFormatting
                        column={column}
                        formatting={formatting}
                      />
                    )}
                  </div>
                </div>
              </ColumnMenu>
            </>
          );
        }}
        tableAddon={
          <div className="dropdown dropdown-end w-full">
            <button
              tabIndex={0}
              type="button"
              className="btn shadow rounded-none opacity-45 hover:opacity-100 transition-opacity"
            >
              <GridIcon />
              {/* <span class="badge badge-xs">{selectedColumns.value.length}</span> */}
            </button>

            <div class="dropdown-content z-100 mb-2">
              <ColumnSelector
                allColumns={allColumns.value}
                selectedColumns={selectedColumns}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};
