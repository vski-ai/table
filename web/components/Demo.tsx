import PlayIcon from "lucide-react/dist/esm/icons/play.js";
import { useRef } from "preact/hooks";
import { EnumeratorModule } from "@/enumerator/mod.ts";
import { createFrontendSorter, SortingModule } from "@/sorting/mod.ts";
import { createTable } from "@/table/mod.ts";

import { generateRows } from "../mock/flat-table.ts";
import { useSignal } from "@preact/signals";
import { playAll } from "./demos/play_all.ts";
import { DataLoadCallback } from "../../mod.ts";

const { data, pinnedRows } = generateRows(1000);
const sorter = createFrontendSorter();

const { store, Table } = createTable({
  id: "demo",
  modules: [
    SortingModule,
    //SelectorPlugin,
    EnumeratorModule,
  ],
});

export const Demo = () => {
  const scrollRef = useRef<any>(null);
  const selectedAction = useSignal<string>("all");
  const playing = useSignal(false);

  const play = async () => {
    playing.value = true;
    switch (selectedAction.value) {
      case "all":
        await playAll(store, scrollRef);
        break;
    }
    playing.value = false;
  };

  const onDataLoad: DataLoadCallback = async ({
    offset,
    limit,
    store,
  }: any) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const sorted = sorter({
      data: data as any,
      store,
    });
    return {
      rows: sorted.slice(offset, offset + limit),
      total: sorted.length,
      meta: {
        sortable_all: true,
        pinnedRows,
      },
    } as any;
  };

  return (
    <div
      class="flex justify-center p-12 overflow-hidden"
      style={{
        pointerEvents: playing.value ? "none" : "all",
      }}
    >
      <div class="mockup-window overflow-hidden shadow-md bg-sky-900/50 dark:bg-sky-800/50  border border-sky-500/50 w-full max-w-340">
        <div class="hidden xl:block bg-tansparent absolute left-0 right-0 w-full text-center top-3.5 h-12 p-0 w-200">
          <h4 class="font-semibold">Core Features</h4>
        </div>
        <div class="bg-tansparent absolute -right-4 top-1 h-12 p-1 w-100">
          <div class="flex gap-3 items-center justify-betwwen">
            <select
              disabled={playing.value}
              defaultValue="Pick a color"
              class="select select-sm rounded-3xl"
            >
              <option value="all">Play all</option>
              <option value="ai_agents" disabled>
                AI Agents
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
          class="border bg-gray-100 dark:bg-gray-800 mt-2 border-accent/10 h-180 w-full overflow-auto rounded-lg"
          ref={scrollRef}
        >
          <Table onDataLoad={onDataLoad} container={scrollRef as any} />
        </div>
        <div class="flex gap-6 p-3 text-sm items-center">
          <div class="flex gap-1 items-center">
            <kbd class="kbd">◀︎</kbd>
            <kbd class="kbd">▶︎</kbd>
            <kbd class="kbd">Tb</kbd>
            Navigate
          </div>
          <div class="flex gap-1 items-center">
            <kbd class="kbd">Enter</kbd>
            Edit
          </div>
          <div class="flex gap-1 items-center">
            <kbd class="kbd">Tb</kbd>
            Jump Out Edit
          </div>
          <div class="flex gap-1 items-center">
            <kbd class="kbd">⌥</kbd>
            Select Cell
          </div>
          <div class="flex gap-1 items-center">
            <kbd class="kbd">⌘</kbd>
            Deselect Cell
          </div>
          <div class="flex gap-1 items-center">
            <kbd class="kbd">Esc</kbd>
            Deselect All
          </div>
        </div>
      </div>
    </div>
  );
};
