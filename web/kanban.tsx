import { LocalStorageAdapter } from "@/module/mod.ts";
import { useEffect, useRef } from "preact/hooks";
import { createTable, type DataLoadCallback } from "../mod.ts";

import { ChatModule, SearchModule } from "@enterprise/mod.ts";
import { ContextModule } from "@enterprise/context/mod.ts";
import { KanbanModule } from "@enterprise/kanban/mod.ts";
import { MatcherModule } from "@enterprise/matcher/mod.ts";
import { EditModeModule } from "@enterprise/editmode/mod.ts";

import { generateKanbanData } from "@enterprise/kanban/mock/kanban.mjs";
import { transformKanbanData } from "@/enterprise/kanban/utils.ts";

const data = transformKanbanData(generateKanbanData() as any);

export const KanbanTable = () => {
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    scrollRef.current = document.querySelector(".main-outlet");
  }, []);

  const { Table } = createTable({
    id: "kanban",
    modules: [
      //SortingModule,
      //EnumeratorModule,
      ChatModule,
      ContextModule,
      SearchModule,
      KanbanModule,
      MatcherModule,
      EditModeModule,
    ],
    persistence: new LocalStorageAdapter(),
  });

  const onDataLoad: DataLoadCallback = async ({ offset, limit, store }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      rows: data.slice(offset, offset + limit) as any,
      total: data.length,
      meta: {
        sortable_all: true,
        //pinnedRows,
      },
    };
  };

  return (
    <div class="relative" ref={scrollRef}>
      <Table onDataLoad={onDataLoad} container={scrollRef} />
    </div>
  );
};
