import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { generateGroupData } from "./mock/groupable-table.ts";
import { useEffect, useRef } from "preact/hooks";
import { Row } from "@/table/types.ts";

const data = generateGroupData();

export const BasicTable = () => {
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "basic-table",
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
    return {
      rows: data.slice(offset, offset + limit),
      total: data.length,
    };
  };

  return (
    <TableView
      onDataLoad={onDataLoad}
      columns={allColumns}
      store={tableStore}
      scrollContainerRef={scrollRef}
      groupable
      selectable
      sortable
      enumerable
    />
  );
};
