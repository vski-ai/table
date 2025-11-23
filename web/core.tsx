import { LocalStorageAdapter } from "@xmod/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateRows } from "./mock/flat-table.ts";
const { data, pinnedRows } = generateRows(5000);
const sorter = createFrontendSorter();

export const CoreTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "flat",
    modules: [SortingModule, EnumeratorModule],
    storage: new LocalStorageAdapter(),
  });

  const onDataLoad: DataLoadCallback = async ({ offset, limit, store }) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const sorted = sorter({
      data: data as RowData[],
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortable_all: false,
        //pinnedRows,
      },
    };
  };

  return (
    <div class="relative" ref={scrollRef}>
      <Table onDataLoad={onDataLoad} container={scrollRef} />
    </div>
  );
};
