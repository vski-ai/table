import { LocalStorageAdapter } from "@xmod/mod.ts";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { RowData } from "@/row/types.ts";
import { createTable, type DataLoadCallback } from "../mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";

import { EnumeratorModule } from "../enumerator/mod.ts";
import { generateRows } from "@enterprise/colgroup/mock/colGroups.ts";
import { ChatModule, SearchModule } from "@enterprise/mod.ts";
import { ContextModule } from "@enterprise/context/mod.ts";
import { SelectorModule } from "@enterprise/selector/mod.ts";
import { MatcherModule } from "@enterprise/matcher/mod.ts";
import { EditModeModule } from "@enterprise/editmode/mod.ts";
import { ColgroupModule } from "@enterprise/colgroup/mod.ts";

const data = generateRows(50) as any;
const sorter = createFrontendSorter();

const mock_user_settings = {
  columns: [
    {
      name: "EMEA",
      widths: {},
      colspan: 3,
      column: "Germany/France/UK",
      children: ["Germany", "France", "UK"],
    },
    {
      widths: {},
      colspan: 3,
      column: "USA/Canada/Mexico",
      children: ["USA", "Canada", "Mexico"],
      name: "North America",
      folded: true,
    },
    {
      widths: {},
      colspan: 4,
      column: "2023Q1/2023Q2/2023Q3/2023Q4",
      children: ["2023Q1", "2023Q2", "2023Q3", "2023Q4"],
      name: "2023",
      folded: true,
    },
    {
      widths: {},
      colspan: 4,
      column: "2024Q1/2024Q2/2024Q3/2024Q4",
      children: ["2024Q1", "2024Q2", "2024Q3", "2024Q4"],
      name: "2024",
      folded: true,
    },
    {
      widths: {},
      colspan: 4,
      column: "2025Q1/2025Q2/2025Q3/2025Q4",
      children: ["2025Q1", "2025Q2", "2025Q3", "2025Q4"],
      name: "2025",
      folded: true,
    },
    {
      widths: {},
      colspan: 4,
      column: "2026Q1/2026Q2/2026Q3/2026Q4",
      children: ["2026Q1", "2026Q2", "2026Q3", "2026Q4"],
      name: "2026",
    },
    {
      widths: {},
      colspan: 4,
      column: "Hardware/Software/Services/Consulting",
      children: ["Hardware", "Software", "Services", "Consulting"],
      name: "Product Line",
    },
    {
      widths: {},
      colspan: 4,
      column: "Retail/B2B/Government/Healthcare",
      children: ["Retail", "B2B", "Government", "Healthcare"],
      name: "Sector",
    },
  ],
};

const datatype_mock = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  locale: "en-GB",
  style: "currency",
  currencyDisplay: "symbol",
  currency: "CHF",
};

const folded_columns = {
  USA: true,
  Canada: true,
  Mexico: true,
  "2023Q1": true,
  "2023Q2": true,
  "2023Q3": true,
  "2023Q4": true,
  "2024Q1": true,
  "2024Q2": true,
  "2024Q3": true,
  "2024Q4": true,
  "2025Q1": true,
  "2025Q2": true,
  "2025Q3": true,
  "2025Q4": true,
};

export const GroupColumnsTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table, store } = createTable({
    id: "group-cols",
    modules: [
      SortingModule,
      //EnumeratorModule,
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
  const columns = store.state.colgroup.columns;
  const folded = store.state.colgroup.folded_columns;
  useMemo(() => {
    store.state.columns.ordered.value = [];
    columns.value = mock_user_settings.columns;
    folded.value = folded_columns;
    mock_user_settings.columns.forEach((c) =>
      c.children.forEach((col) => {
        store.state.data_type.column.value[col] = "currency";
        store.state.data_type.options.value[col] = datatype_mock;
      }),
    );
  }, []);

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
