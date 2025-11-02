import { TableView } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { Row } from "@/table/types.ts";
import data from "./mock/group-1m-rows.json" with { type: "json" };
import { createPluginContainer } from "@/plugin/mod.ts";
import { sorterPlugin, sorterStore } from "@/sorting/mod.ts";

export const GroupTable = () => {
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "basic-table",
    [
      sorterStore,
    ],
  );

  const plugins = createPluginContainer([
    sorterPlugin(),
  ], tableStore);

  const allColumns = Object.keys(data?.[0] ?? {}).filter((c) => {
    return !c.startsWith("$") && !["id", "Year", "Month"].includes(c);
  });
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  });

  const onDataLoad = async ({ store, offset, limit }) => {
    const d = data.filter((r) =>
      r.$parent_id?.every(
        (id: string | number) =>
          store.state.expandedLevels.value?.includes(id as never),
      ) || r.$group_level === 0
    );
    return {
      rows: d.slice(offset, offset + limit),
      total: d.length,
      meta: {
        sortableColumns: ["Company", "Hourly Rate"],
        sortableGroupLevelColumns: [
          [],
          ["First Name", "Last Name"],
        ],
      },
    };
  };

  return (
    <TableView
      onDataLoad={onDataLoad}
      columns={allColumns}
      store={tableStore}
      scrollContainerRef={scrollRef}
      plugins={plugins}
      groupable
      selectable
      enumerable
    />
  );
};
