# Table Plugin Architecture

This document outlines a proposed plugin architecture for the table component.
The goal is to make the table as extensible as possible, allowing developers to
add new features through a clean and consistent API.

## Core Concepts

The plugin architecture is based on two core concepts:

- **`TablePlugin`**: An interface that defines the shape of a plugin. Plugins
  are objects that can provide extensions for various parts of the table.
- **`PluginContainer`**: A class that manages the registration and lifecycle of
  plugins. It will be responsible for loading plugins (including asynchronously)
  and making them available to the table.

## `TablePlugin` Interface

The `TablePlugin` interface defines the different ways a plugin can extend the
table.

```typescript
interface TablePlugin {
  // A unique name for the plugin
  name: string;

  // Extend the table store with additional state and commands
  store?: (store: TableStore) => Partial<TableState>;

  // Add custom cell renderers
  cellRenderers?: {
    [columnType: string]: (value: any, row: any) => preact.ComponentChildren;
  };

  // Add custom menu items to the column menu
  columnMenuItems?: (
    column: string,
    store: TableStore,
  ) => preact.ComponentChildren;

  // Add custom components to the table, e.g., a custom toolbar
  components?: {
    [name: string]: preact.ComponentType<any>;
  };

  // A lifecycle method that is called when the plugin is initialized
  initialize?: (store: TableStore) => void;

  // A hook that is called before data is loaded
  beforeLoad?: (options: LoadOptions) => Promise<LoadOptions>;

  // A hook that is called after data is loaded
  afterLoad?: (data: any[]) => Promise<any[]>;
}

interface LoadOptions {
  filters: any[];
  sorting: any[];
  // ... other options
}
```

## `PluginContainer`

The `PluginContainer` is responsible for managing the plugins. It will be
created before the table is initialized and passed to the `TableView` component.

```typescript
class PluginContainer {
  private plugins: TablePlugin[] = [];

  constructor(plugins: TablePlugin[]) {
    this.plugins = plugins;
  }

  // Asynchronously load and register plugins
  static async create(
    pluginLoaders: (() => Promise<TablePlugin>)[],
  ): Promise<PluginContainer> {
    const plugins = await Promise.all(pluginLoaders.map((loader) => loader()));
    return new PluginContainer(plugins);
  }

  // Get all registered plugins
  getPlugins(): TablePlugin[] {
    return this.plugins;
  }

  // Get a specific plugin by name
  getPlugin(name: string): TablePlugin | undefined {
    return this.plugins.find((p) => p.name === name);
  }

  // ... other methods to query plugins for specific extensions
}
```

The `PluginContainer.create` static method is the key to supporting
asynchronously loaded plugins, which is a requirement for microfrontends.

## Integration with the Table

The `TableView` component will accept a `PluginContainer` instance as a prop. It
will then use the container to integrate the extensions provided by the plugins.

### Store Extensions

The `createTableStore` function will be modified to accept the
`PluginContainer`. It will iterate over the plugins and apply the store
extensions.

```typescript
// in store/table.ts
export function createTableStore(
  storage?: StorageAdapter,
  tableId?: string,
  pluginContainer?: PluginContainer,
): TableStore {
  // ... existing code

  // Apply store extensions from plugins
  if (pluginContainer) {
    for (const plugin of pluginContainer.getPlugins()) {
      if (plugin.store) {
        const extension = plugin.store(store);
        Object.assign(state, extension);
      }
    }
  }

  // ... existing code
}
```

### Cell Renderers

The `useRenderRowCallback` hook will be modified to use the custom cell
renderers from the plugins.

```typescript
// in table/Row.tsx
const renderRow = useRenderRowCallback({
  // ... existing props
  pluginContainer,
});

// in useRenderRowCallback
const {
  // ...
  pluginContainer,
} = props;

// ...

const renderCell = (row: any, column: string) => {
  const columnType = getColumnType(column); // a new function to get the column type
  if (pluginContainer) {
    for (const plugin of pluginContainer.getPlugins()) {
      if (plugin.cellRenderers && plugin.cellRenderers[columnType]) {
        return plugin.cellRenderers[columnType](row[column], row);
      }
    }
  }
  // Default cell renderer
  return <CellFormatter value={row[column]} />;
};
```

### Column Menu Items

The `ColumnMenu` component will be modified to render the custom menu items from
the plugins.

```typescript
// in menu/ColumnMenu.tsx
export const ColumnMenu = ({
  column,
  store,
  pluginContainer,
}: MenuProps) => {
  // ... existing code

  return (
    <div>
      {/* ... existing tabs ... */}

      {/* Render menu items from plugins */}
      {pluginContainer?.getPlugins().map((plugin) => (
        plugin.columnMenuItems?.(column, store)
      ))}
    </div>
  );
};
```

## Example Usage

Here's how you would initialize the table with a set of plugins, including one
that is loaded asynchronously.

```typescript
// main.tsx

import { render } from "preact";
import { TableView } from "@/table/TableView.tsx";
import { createTableStore } from "@/store/table.ts";
import { PluginContainer } from "@/plugins/PluginContainer.ts";
import MyPlugin from "@/plugins/MyPlugin.ts";

async function main() {
  const pluginContainer = await PluginContainer.create([
    () => Promise.resolve(MyPlugin),
    () => import("./plugins/AnotherPlugin.ts").then((m) => m.default),
  ]);

  const store = createTableStore(undefined, "my-table", pluginContainer);

  render(
    <TableView
      data={data}
      columns={columns}
      store={store}
      pluginContainer={pluginContainer}
    />,
    document.getElementById("app")!,
  );
}

main();
```

## Conclusion

This plugin architecture provides a solid foundation for building a highly
extensible table component. It is flexible enough to support a wide range of use
cases, and the support for asynchronous plugin loading makes it suitable for
modern web applications, including those built with microfrontends.
