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
import { GanttModule } from "@enterprise/gantt/mod.ts";

import {
  filterGanttRows,
  ganttTableMeta,
  generateGanttData,
} from "@enterprise/gantt/mock/gantt-data.mjs";
const data = generateGanttData();
const sorter = createFrontendSorter();

export const GanttTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table, store } = createTable({
    id: "gantt",
    modules: [
      SortingModule,
      //EnumeratorModule,
      ChatModule,
      ContextModule,
      SearchModule,
      SelectorModule,
      MatcherModule,
      EditModeModule,
      GroupingModule,
      GanttModule,
    ],
    storage: new LocalStorageAdapter(),
  });

  store.state.data_type.column.value = {
    "Stock Price": "currency",
    Revenue: "currency",
    Tax: "currency",
  };
  store.state.columns.sticky.value = {
    __group_by__: "left",
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
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    const rows = filterGanttRows(data, store);
    return {
      rows: rows.slice(offset, offset + limit),
      total: rows.length,
      meta: ganttTableMeta,
    };
  };

  return (
    <div class="relative" ref={scrollRef}>
      <Table
        onDataLoad={onDataLoad}
        container={scrollRef}
        scrollEffect={false}
      />
    </div>
  );
};
