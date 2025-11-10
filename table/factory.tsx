import {
  createTableStore,
  LocalStorageAdapter,
  StorageAdapter,
  StoreModule,
  TableStore,
} from "@/store/mod.ts";
import {
  buildInPlugins,
  createPluginContainer,
  ITablePlugin,
} from "@/plugin/mod.ts";
import { Table as TableView, TableProps as TableViewProps } from "./table.tsx";
import { ComponentChildren } from "preact";
import { MutableRef } from "preact/hooks";

type CreateTableOpts = {
  id: string;
  plugins: ITablePlugin[];
  persistence?: StorageAdapter;
};

type Result = {
  store: TableStore;
  Table: (props: TableProps) => ComponentChildren;
};

type TableProps = {
  container: MutableRef<HTMLElement>;
  onDataLoad: TableViewProps["onDataLoad"];
};

export function createTable(
  { id, plugins, persistence }: CreateTableOpts,
): Result {
  const modules: StoreModule[] = [...buildInPlugins, ...plugins].map((p) =>
    p.store
  ).filter((p) => !!p);
  const store = createTableStore(
    persistence ?? new LocalStorageAdapter(),
    id,
    modules,
  );

  createPluginContainer(store, plugins);

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
