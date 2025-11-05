import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { Row } from "@/table/types.ts";
import data from "./mock/group-1m-rows.json" with { type: "json" };
import { createPluginContainer } from "@/plugin/mod.ts";
import {
  createFrontendSorter,
  plugin as sorterPlugin,
  store as sorterStore,
} from "@/sorting/mod.ts";
import { plugin as enumPlugin, store as enumStore } from "../enumerator/mod.ts";
import {
  plugin as groupingPlugin,
  store as groupingStore,
} from "@/grouping/mod.ts";
import { DataLoadCallback } from "@/fetcher/types.ts";

const sorter = createFrontendSorter();

export const GroupTable = () => {
  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet")!;
  });
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "basic-table",
    [
      enumStore,
      sorterStore,
      groupingStore,
    ],
  );

  createPluginContainer(
    tableStore,
    [
      enumPlugin(),
      groupingPlugin(),
      sorterPlugin(),
    ],
  );
  const onDataLoad: DataLoadCallback = async (
    { store, offset, limit, sort },
  ) => {
    //await new Promise((r) => setTimeout(r, 1000));

    const sorted = sorter({
      data,
      store,
    });

    const d = sorted.filter((r) =>
      r.$parent_id?.every(
        (id: string | number) =>
          store.state?.expandedLevels?.value?.includes(id as never),
      ) || !r.$group_level
    );

    return {
      rows: (d as Row[]).slice(offset, offset + limit),
      total: d.length,
      meta: {
        groupBy: ["Year", "Month", "Company"],
        sortableColumns: ["Year", "Hourly Rate", "Year", "Month"],
        sortableGroupLevelColumns: [
          ["Month"],
          ["Company", "First Name", "Last Name"],
          [],
        ],
      },
    };
  };

  return (
    <TableView
      onDataLoad={onDataLoad}
      store={tableStore}
      scrollContainerRef={scrollRef}
      groupable
      selectable
      enumerable
    />
  );
};
