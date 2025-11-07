import { Table } from "@/table.tsx";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import data from "./mock/flat-1m-rows.json" with { type: "json" };
import { RowData } from "@/row/types.ts";
import { createPluginContainer } from "@/plugin/mod.ts";
import {
  createFrontendSorter,
  SortingPlugin,
  SortingStore,
} from "@/sorting/mod.ts";

import { SelectorPlugin, SelectorStore } from "@/selector/mod.ts";
import { EnumeratorPlugin, EnumeratorStore } from "../enumerator/mod.ts";

const sorter = createFrontendSorter();

export const FlatTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  });
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "flat-table",
    [
      SortingStore,
      SelectorStore,
      EnumeratorStore,
    ],
  );

  createPluginContainer(tableStore, [
    SortingPlugin,
    SelectorPlugin,
    EnumeratorPlugin,
  ]);

  const onDataLoad = async (
    { offset, limit, store }: any,
  ): Promise<{ rows: RowData[]; total: number }> => {
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorted = sorter({
      data: (data as RowData[]),
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortableAll: true,
      },
    } as any;
  };

  return (
    <Table
      onDataLoad={onDataLoad}
      store={tableStore}
      scrollContainerRef={scrollRef as any}
    />
  );
};
