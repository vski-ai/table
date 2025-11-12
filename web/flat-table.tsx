import { LocalStorageAdapter } from "@/module/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { SelectorPlugin } from "@/selector/mod.ts";
import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateRows } from "./mock/flat-table.ts";

let generated;
try {
  JSON.parse(localStorage.getItem("flat_table") ?? "null");
  if (!generated) {
    generated = generateRows(5000);
    localStorage.setItem("flat_table", JSON.stringify(generated));
  }
} catch (e) {
  generated = generateRows(10000);
}

const { data, pinnedRows } = generated;
const sorter = createFrontendSorter();

export const FlatTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "flat",
    modules: [
      SortingModule,
      //SelectorPlugin,
      EnumeratorModule,
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
