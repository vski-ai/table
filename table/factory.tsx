import { createApp, type CreateAppOpts, type Store } from "@xmod/mod.ts";
import { Table as TableView, TableProps as TableViewProps } from "./table.tsx";
import { ComponentChildren } from "preact";
import { MutableRef, useEffect } from "preact/hooks";

import { TableModule } from "@/table/module.ts";
import { TableCellModule } from "@/cell/mod.ts";
import { TableColumnsModule } from "@/columns/mod.ts";
import { ContextMenuModule } from "@/ctxmenu/mod.ts";
import { DatatypeModule } from "@/datatype/mod.ts";
import { EditingModule } from "@/editing/mod.ts";
import { StylingModule } from "@/styling/mod.ts";
import { InputModule } from "@/input/mod.ts";
import { DataFetcherModule } from "@/fetcher/mod.ts";
import { RowsModule } from "@/row/mod.ts";

type Result = {
  store: Store;
  Table: (props: TableProps) => ComponentChildren;
};

type TableProps = {
  container: MutableRef<HTMLElement>;
  onDataLoad: TableViewProps["onDataLoad"];
  scrollEffect?: TableViewProps["scrollEffect"];
};

export const modules = [
  TableModule,
  DataFetcherModule,
  TableCellModule,
  TableColumnsModule,
  RowsModule,
  ContextMenuModule,
  DatatypeModule,
  EditingModule,
  InputModule,
  StylingModule,
];

export function createTable(props: CreateAppOpts): Result {
  const store = createApp({
    ...props,
    modules: [...modules, ...props.modules],
  });
  return {
    store,
    Table({ container, onDataLoad, scrollEffect }: TableProps) {
      store.scrollContainerRef = container;
      useEffect(() => {
        container.current?.classList.add("vt-wrapper");
      }, [container.current]);

      return (
        <TableView
          store={store}
          scrollContainerRef={container}
          scrollEffect={scrollEffect}
          onDataLoad={onDataLoad}
        />
      );
    },
  };
}
