import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import data from "./mock/flat-1m-rows.json" with { type: "json" };
import { Row } from "@/table/types.ts";
import { createPluginContainer } from "@/plugin/mod.ts";
import {
  createFrontendSorter,
  sorterPlugin,
  sorterStore,
} from "@/sorting/mod.ts";

const tableStore = createTableStore(
  new LocalStorageAdapter(),
  "flat-table",
  [
    sorterStore,
  ],
);

createPluginContainer(tableStore, [
  sorterPlugin(),
]);

const sorter = createFrontendSorter();

export const FlatTable = () => {
  const allColumns = Object.keys(data?.[0] ?? {});
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  });

  const onDataLoad = async (
    { offset, limit, store }: any,
  ): Promise<{ rows: Row[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const sorted = sorter({
      data: (data as Row[]),
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortableAll: true,
      },
    } as any;
  };

  return (
    <TableView
      onDataLoad={onDataLoad}
      columns={allColumns}
      store={tableStore}
      scrollContainerRef={scrollRef as any}
      selectable
      enumerable
      sortable
    />
  );
};
