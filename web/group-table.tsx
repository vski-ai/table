import { Table } from "../table/table.tsx";
import { createTableStore, LocalStorageAdapter } from "@/module/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { generateRows } from "./mock/group-table.ts";
import { createPluginContainer } from "@/module/mod.ts";
import {
  createFrontendSorter,
  SortingPlugin,
  SortingStore,
} from "@/sorting/mod.ts";
import { EnumeratorModule, EnumeratorStore } from "@/enumerator/mod.ts";
import { GroupingPlugin, GroupingStore } from "@/grouping/mod.ts";
import { DataLoadCallback } from "@/fetcher/types.ts";

const sorter = createFrontendSorter();
const data = generateRows();

export const GroupTable = () => {
  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet")!;
  });

  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "basic-table",
    [EnumeratorStore, SortingStore, GroupingStore],
  );

  createPluginContainer(tableStore, [
    EnumeratorModule,
    GroupingPlugin,
    SortingPlugin,
  ]);

  const onDataLoad: DataLoadCallback = async ({
    store,
    offset,
    limit,
    sort,
  }) => {
    await new Promise((r) => setTimeout(r, 500));

    const sorted = sorter({
      data,
      store,
    });

    const d = sorted.filter(
      (r) =>
        r.$parent_id?.every((id: string | number) =>
          store.state?.expandedLevels?.value?.includes(id as never)
        ) || !r.$group_level,
    );

    return {
      rows: (d as RowData[]).slice(offset, offset + limit),
      total: d.length,
      meta: {
        group_by: ["Year", "Month", "Company"],
        sortable_columns: ["Year", "Hourly Rate", "Year", "Month"],
        group_sorting_level_columns: [
          ["Month"],
          ["Company", "First Name", "Last Name"],
          [],
        ],
      },
    };
  };

  return (
    <Table
      onDataLoad={onDataLoad}
      store={tableStore}
      scrollContainerRef={scrollRef}
      groupable
      selectable
      enumerable
    />
  );
};
