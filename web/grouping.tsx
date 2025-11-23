import { LocalStorageAdapter } from "@xmod/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";

import { ChatModule, SearchModule } from "@enterprise/mod.ts";
import { ContextModule } from "@enterprise/context/mod.ts";
import { SelectorModule } from "@enterprise/selector/mod.ts";
import { MatcherModule } from "@enterprise/matcher/mod.ts";
import { EditModeModule } from "@enterprise/editmode/mod.ts";
import { GroupingModule } from "@enterprise/grouping/mod.ts";

import {
  filterGroupedRows,
  generateGroupedRows,
} from "@enterprise/grouping/mock/group-table.mjs";
const data = generateGroupedRows();
const sorter = createFrontendSorter();

export const GroupedTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table, store } = createTable({
    id: "tree",
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

  store.state.data_type.column.value = {
    "Stock Price": "currency",
    Revenue: "currency",
    Tax: "currency",
  };
  const currencyOpts = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    locale: "en-GB",
    style: "currency",
    currencyDisplay: "symbol",
    currency: "USD",
  };
  store.state.data_type.options.value = {
    "Stock Price": currencyOpts,
    Revenue: currencyOpts,
    Tax: currencyOpts,
  };

  const onDataLoad: DataLoadCallback = async ({ offset, limit, store }) => {
    //await new Promise((resolve) => setTimeout(resolve, 500));
    const sorted = sorter({
      data: data as any,
      store,
    });
    const rows = filterGroupedRows(sorted, store);
    return {
      rows: rows.slice(offset, offset + limit),
      total: rows.length,
      meta: {
        sortable_all: true,
        group_sorting_all: true,
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
