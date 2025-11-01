import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import data from "./mock/flat-1m-rows.json" with { type: "json" };

export const FlatTable = () => {
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "flat-table",
  );

  const allColumns = Object.keys(data?.[0] ?? {});
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  });
  return (
    <TableView
      data={data}
      columns={allColumns}
      store={tableStore}
      scrollContainerRef={scrollRef as any}
      selectable
      sortable
      enumerable
    />
  );
};
