import { LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable } from "../mod.ts";
import { createFrontendSorter, SortingPlugin } from "@/sorting/mod.ts";

import { SelectorPlugin } from "@/selector/mod.ts";
import { EnumeratorPlugin } from "../enumerator/mod.ts";
import { generateRows } from "./mock/flat-table.ts";
import mock from "./mock/flat-persistent-data.json" with { type: "json" };

const { data, pinnedRows } = mock; // generateRows(10000);
const sorter = createFrontendSorter();

export const FlatTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "flat",
    plugins: [
      SortingPlugin,
      //SelectorPlugin,
      EnumeratorPlugin,
    ],
    persistence: new LocalStorageAdapter(),
  });

  const onDataLoad = async (
    { offset, limit, store }: any,
  ): Promise<{ rows: RowData[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorted = sorter({
      data: (data as RowData[]),
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortableAll: true,
        pinnedRows,
      },
    } as any;
  };

  return (
    <div ref={scrollRef}>
      <Table
        onDataLoad={onDataLoad}
        container={scrollRef as any}
      />
    </div>
  );
};
