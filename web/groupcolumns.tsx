import { LocalStorageAdapter } from "@xmod/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateRows } from "./mock/flat-table.ts";
import { ChatModule, SearchModule } from "@enterprise/mod.ts";
import { ContextModule } from "@enterprise/context/mod.ts";
import { SelectorModule } from "@enterprise/selector/mod.ts";
import { MatcherModule } from "@enterprise/matcher/mod.ts";
import { EditModeModule } from "@enterprise/editmode/mod.ts";
import { ColgroupModule } from "@enterprise/colgroup/mod.ts";

const { data, pinnedRows } = generateRows(100);
const sorter = createFrontendSorter();

export const GroupColumnsTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "group-cols",
    modules: [
      SortingModule,
      EnumeratorModule,
      ChatModule,
      ContextModule,
      SearchModule,
      SelectorModule,
      MatcherModule,
      EditModeModule,
      ColgroupModule,
    ],
    storage: new LocalStorageAdapter(),
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
    <div class="relative" ref={scrollRef}>
      <Table onDataLoad={onDataLoad} container={scrollRef} />
    </div>
  );
};
