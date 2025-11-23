import { LocalStorageAdapter } from "@xmod/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateRows } from "./mock/flat-table.ts";

const { data, pinnedRows } = generateRows(0);
const sorter = createFrontendSorter();

export const EditableTable = () => {
  const scrollRef = useRef<any>(null);

  const { Table } = createTable({
    id: "editable",
    modules: [
      SortingModule,
      //SelectorPlugin,
      EnumeratorModule,
    ],
    persistence: new LocalStorageAdapter(),
  });

  const onDataLoad: DataLoadCallback = async ({ offset, limit, store }) => {
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorted = sorter({
      data: data as RowData[],
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortable_all: true,
        //pinnedRows,
      },
    };
  };

  return (
    <div ref={scrollRef}>
      <Table onDataLoad={onDataLoad} container={scrollRef as any} />
    </div>
  );
};
