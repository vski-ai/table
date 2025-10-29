import { DynamicTable } from "@/table/mod.ts";
import { createTableStore, LocalStorageAdapter } from "@/store/mod.ts";
import { generateGroupData } from "./mock/groupable-table.ts";
import { useMemo } from "preact/hooks";

export const BasicTable = () => {
  const tableStore = createTableStore(
    new LocalStorageAdapter(),
    "basic-table",
  );
  const data = useMemo(() => generateGroupData(), []);
  const allColumns = Object.keys(data?.[0] ?? {});

  return (
    <div>
      <DynamicTable
        data={data}
        columns={allColumns}
        store={tableStore}
        selectable
        sortable
      />
    </div>
  );
};
