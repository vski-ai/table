import {
  createTableStore,
  LocalStorageAdapter,
  StorageAdapter,
  StoreModule,
  TableStore,
} from "@/module/mod.ts";
import {
  createTableModule,
  CreateTableModuleOpts,
  ITableModule,
} from "@/module/mod.ts";
import { Table as TableView, TableProps as TableViewProps } from "./table.tsx";
import { ComponentChildren } from "preact";
import { MutableRef } from "preact/hooks";

type Result = {
  store: TableStore;
  Table: (props: TableProps) => ComponentChildren;
};

type TableProps = {
  container: MutableRef<HTMLElement>;
  onDataLoad: TableViewProps["onDataLoad"];
};

export function createTable(
  props: CreateTableModuleOpts,
): Result {
  const store = createTableModule(props);
  return {
    store,
    Table({ container, onDataLoad }: TableProps) {
      store.scrollContainerRef = container;
      return (
        <TableView
          store={store}
          scrollContainerRef={container}
          onDataLoad={onDataLoad}
        />
      );
    },
  };
}
