![vski table](./web/public/vskitable.svg)

---------------

## Getting Started

### Using Table

```tsx
import { createTable, LocalStorageAdapter, type DataLoadCallback } from "@vski/table/mod.ts";
import { useRef } from "preact/hooks";

export function MyTable() {

  const scrollRef = useRef<HTMLDivElement>(null);

  const { Table, store: _store } = createTable({
    id: "my-table-id", // must be a unique id
    persistence: new LocalStorageAdapter(),
  });

  // Data Load Callback
  const onDataLoad: DataLoadCallback = async (
    { offset, limit, store }
  ) => {
    return {
      rows: [{ id: 'required', attribute: 'value' }],
      total: 1
    }
  }

  return (
    <div class="w h overflow-auto" ref={scrollRef}>
      <Table 
        onDataLoad={onDataLoad}
        container={scrollRef}
      >
    </div>
  )
}
```

### Mutating State

We can do almost anything by dispatching commands. The modules should care to
provide the command types and docs for LLMs.

This is a recommended way of mutating state inside the table.

```ts
import type { ConsumeCmdType } from "some-module";

store.dispatch<ConsumeType>({
  type: "CONSUME_TYPE_UNIQ_COMMAND_ID",
  payload: "Payload According to Consume Type",
  history: false, // record history
});
```

Another way to mutate state is to access `store.state` directly. Most of the
properties there are signals and can be mutated directly. It is not recommended,
especially when implementing agentic flows.

```ts
store.state.columns.header_height.value = 42;
```

## Module System

The module system is designed to be simple and scalable. A module is an object
that provides callbcaks:

```ts
import * as store from "./store.ts";

import { ITableModule, ModuleInitCallback } from "@/module/types.ts";

const onInit: ModuleInitCallback = ({ store, ...rest }) => {};

export const MyModule: ITableModule = {
  name: "mymodule",
  onInit,
  store: KeyboardStore,
};
```

There are callbacks such as: `beforeLoad` and `afterLoad`. See
[typedef](./module/types.ts) for info.

## Store

Store prodes factories and calbacks that extend the table store.

Here is an example of build-in keyboard store:

```ts
import { Signal, signal } from "@preact/signals";
import { Command, InferPerstist, TableState } from "@/module/mod.ts";

type MyState = {
  mystate: {
    prop: Signal<boolean>;
  };
};

declare module "@/module/types.ts" {
  interface TableState extends MyState {}
}

// A state to be added to the table store
export function state(pesist: InferPerstist<MyState>): MyState {
  return {
    mystate: {
      prop: signal(pesist.mystate.prop ?? false),
    },
  };
}

// The persist callback, must return state attributes
// as a JSON serializable object.
// Here we explicitly specify what is needes to pesist
export function persist(state: TableState): InferPerstist<MyState> {
  return {
    mystate: {
      prop: state.mystate.prop.value,
    },
  };
}

// State mutation for `store.dispatch`.
// A command spec is { type: string, payload:<P>, persist: boolean }
// Pesist flag is for dispatch handler, it isn't used here.
export function mutate<T>(state: TableState, _: Command<T>) {
}
```

See more complete examples at any module, for example in
[columns](./columns/store.ts)

### Addons

Addons provide render callbacks for pre-defined render slots (beforetable,
aftertable, etc). The slots are passed to a module init callback.

```ts
import { myModalRenderCallback } from "./MyModal.tsx";

const onInit: ModuleInitCallback = ({
  store,
  beforetable,
}) => {
  beforetable.use(-1, myModalRenderCallback);
};
```

The first argunent in the `use` method represents render order - this is useful
if you have components coming one after another and display order is important.
Each render slot, like `beforetable` has their own callback type defined in
[module typedefs](./module/types.ts).
