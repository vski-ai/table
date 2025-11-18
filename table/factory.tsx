import { TableStore } from "@/module/mod.ts";
import { createTableModule, CreateTableModuleOpts } from "@/module/mod.ts";
import { Table as TableView, TableProps as TableViewProps } from "./table.tsx";
import { ComponentChildren } from "preact";
import { MutableRef, useEffect } from "preact/hooks";

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
      useEffect(() => {
        container.current?.classList.add("vt-wrapper");
      }, [container.current]);

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
