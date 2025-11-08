import PlayIcon from "lucide-react/dist/esm/icons/play.js";
import { useRef } from "preact/hooks";
import { SelectorPlugin } from "@/selector/mod.ts";
import { EnumeratorPlugin } from "@/enumerator/mod.ts";
import { createFrontendSorter, SortingPlugin } from "@/sorting/mod.ts";
import { createTable } from "@/table/mod.ts";

import { generateRows } from "../mock/flat-table.ts";
import { useSignal } from "@preact/signals";

import { resizableColumns, resizableRows } from "./demos/resizing.ts";
import {
  stickyColumns,
  stickyRightColumns,
  virtualScroll,
} from "./demos/scrolling.ts";
import { multiselect, navigation } from "./demos/navigation.ts";
import { delay } from "./demos/common.ts";

const { data, pinnedRows } = generateRows(1000);
const sorter = createFrontendSorter();

const { store, Table } = createTable({
  id: "demo",
  plugins: [
    SortingPlugin,
    //SelectorPlugin,
    EnumeratorPlugin,
  ],
});

export const Demo = () => {
  const scrollRef = useRef<any>(null);
  const selectedAction = useSignal<string>("all");
  const playing = useSignal(false);

  let slowNetwork = 0;
  const setAction = (ev) => {
    selectedAction.value = ev.target.value;
  };
  const playAll = async () => {
    selectedAction.value = "column_width";
    await resizableColumns(store);
    await delay(500);

    selectedAction.value = "row_height";
    await resizableRows(store);
    await delay(500);

    selectedAction.value = "sticky_columns";
    await stickyColumns(store, scrollRef);
    await delay(500);

    selectedAction.value = "sticky_right";
    await stickyRightColumns(store, scrollRef);
    await delay(500);

    selectedAction.value = "navigation";
    await navigation();
    await delay(500);

    selectedAction.value = "multiselect";
    await multiselect();
    await delay(500);

    slowNetwork = 700;
    selectedAction.value = "virtual_scroll";
    await virtualScroll(scrollRef);
    slowNetwork = 0;
  };
  const play = async () => {
    playing.value = true;
    switch (selectedAction.value) {
      case "all":
        await playAll();
        break;
      case "column_width":
        await resizableColumns(store);
        break;
      case "row_height":
        await resizableRows(store);
        break;
      case "sticky_columns":
        await stickyColumns(store, scrollRef);
        break;
      case "sticky_right":
        await stickyRightColumns(store, scrollRef);
        break;
      case "navigation":
        await navigation();
        break;
      case "multiselect":
        await multiselect();
        break;
      case "virtual_scroll":
        slowNetwork = 500;
        await virtualScroll(scrollRef).then(() => slowNetwork = 0);
        break;
    }
    playing.value = false;
  };

  const onDataLoad = async (
    { offset, limit, store }: any,
  ): Promise<{ rows: any; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, slowNetwork));
    const sorted = sorter({
      data: (data as any),
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortableAll: true,
        pinnedRows,
      },
    } as any;
  };

  return (
    <div class="flex justify-center p-12 overflow-hidden">
      <div class="mockup-window overflow-hidden shadow-md bg-sky-900/50 dark:bg-sky-800/50  border border-sky-500/50 w-full max-w-340">
        <div class="hidden xl:block bg-tansparent absolute left-0 right-0 w-full text-center top-3.5 h-12 p-0 w-200">
          <h4 class="font-semibold">
            {(() => {
              switch (selectedAction.value) {
                case "column_width":
                  return "Resizing Columns";
                case "row_height":
                  return "Resizing Rows";
                case "sticky_columns":
                  return "Pin Left";
                case "sticky_right":
                  return "Pin Right";
                case "navigation":
                  return "Keyboard Support";
                case "multiselect":
                  return "Multiple Selection";
                case "virtual_scroll":
                  return "Bidirectional Loading & Virtualization";
              }
              return "Core Features";
            })()}
          </h4>
        </div>
        <div class="bg-tansparent absolute -right-4 top-1 h-12 p-1 w-100">
          <div class="flex gap-3 items-center justify-betwwen">
            <select
              disabled={playing.value}
              onChange={setAction}
              defaultValue="Pick a color"
              className="select select-sm rounded-3xl"
            >
              <option disabled={true}>Core features</option>
              <option value="all">Play all</option>
              <option value="column_width">Resizable columns</option>
              <option value="row_height">Resizable rows</option>
              <option value="sticky_columns">Pin left</option>
              <option value="sticky_right">Pin right</option>
              <option value="navigation">Navigation</option>
              <option value="multiselect">Selection</option>
              <option value="virtual_scroll">
                Bidirectional virtualiziation & loading
              </option>
            </select>
            <button
              onClick={play}
              type="button"
              class={"btn btn-sm btn-circle text-white bg-sky-500 border-1 border-accent/80 shadow-none " +
                (playing.value ? "loading text-transparent!" : "")}
            >
              <PlayIcon />
            </button>
          </div>
        </div>
        <div
          className="border-1 mt-2 border-accent/10 h-180 w-full overflow-auto rounded-lg"
          ref={scrollRef}
        >
          <Table onDataLoad={onDataLoad} container={scrollRef as any} />
        </div>
      </div>
    </div>
  );
};
