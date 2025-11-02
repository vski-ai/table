import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import data from "./mock/flat-1m-rows.json" with { type: "json" };
import { Row } from "@/table/types.ts";

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

  const onDataLoad = async ({ offset, limit }: {
    offset: number;
    limit: number;
  }): Promise<{ rows: Row[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      rows: (data as Row[]).slice(offset, offset + limit),
      total: (data as Row[]).length,
    };
  };

  return (
    <TableView
      onDataLoad={onDataLoad}
      columns={allColumns}
      store={tableStore}
      scrollContainerRef={scrollRef as any}
      selectable
      sortable
      enumerable
    />
  );
};
