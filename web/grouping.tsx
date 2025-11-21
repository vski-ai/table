import { LocalStorageAdapter } from "@/module/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateGroupedRows } from "./mock/group-table.ts";
import { ChatModule, SearchModule } from "@enterprise/mod.ts";
import { ContextModule } from "@enterprise/context/mod.ts";
import { SelectorModule } from "@enterprise/selector/mod.ts";
import { MatcherModule } from "@enterprise/matcher/mod.ts";
import { EditModeModule } from "@enterprise/editmode/mod.ts";
import { GroupingModule } from "@enterprise/grouping/mod.ts";

const data = generateGroupedRows();
const sorter = createFrontendSorter();

export const GroupedTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "flat",
    modules: [
      SortingModule,
      EnumeratorModule,
      ChatModule,
      ContextModule,
      SearchModule,
      SelectorModule,
      MatcherModule,
      EditModeModule,
      GroupingModule,
    ],
    persistence: new LocalStorageAdapter(),
  });

  const onDataLoad: DataLoadCallback = async ({ offset, limit, store }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorted = sorter({
      data: data as any,
      store,
    });
    const rows = sorted.filter((c) =>
      c.$parent_id
        ? c.$parent_id.every((id) =>
          store.state.grouping.expanded.value.includes(id as any)
        )
        : true
    );
    console.log(rows.slice(offset, offset + limit));
    return {
      rows: rows.slice(offset, offset + limit),
      total: rows.length,
      meta: {
        sortable_all: true,
        group_by: ["Year", "Month", "Company"],
      },
    };
  };

  return (
    <div class="relative" ref={scrollRef}>
      <Table onDataLoad={onDataLoad} container={scrollRef} />
    </div>
  );
};
