import {
  ColumnSelector,
  ColumnSorter,
  DynamicTable,
  SortState,
} from "@/table/mod.ts";

import { Formatting } from "../format/index.tsx";

import { useSignal } from "@preact/signals";
import { useMemo, useRef } from "preact/hooks";
import { ColumnMenu } from "@/menu/ColumnMenu.tsx";

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
        <ColumnMenu
          column={columnMenuTarget.value}
          openSignal={columnMenuOpenSignal}
          store={{
            formatting,
          }}
        />
      </div>

      <DynamicTable
        data={data}
        columns={selectedColumns.value}
        cellFormatting={formatting.value}
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
          return (
            <>
              <button
                onClick={() => {
                  columnMenuTarget.value = column;
                  columnMenuOpenSignal.value = true;
                }}
              >
                0
              </button>
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
