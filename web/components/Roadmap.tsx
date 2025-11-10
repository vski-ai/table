import { MutableRef } from "preact/hooks";
import { TodoItem } from "./TodoItem.tsx";

export function Roadmap(
  { refEl }: { refEl: MutableRef<HTMLDivElement | null> },
) {
  return (
    <div
      ref={refEl}
      class="container container mx-auto w-full flex justify-center"
    >
      <div class="w-full flex flex-col items-center">
        <h1 class="mt-12 mb-12 text-4xl font-bold text-center">
          Roadmap
        </h1>

        <ul class="timeline timeline-vertical! gap-6 w-16">
          <TodoItem start done>
            <div class="text-right">
              <span class="badge badge-sm mb-2 -mr-2">Oct, 2025</span>
            </div>
            The month of R&D. Building and testing MVPs, backend and fronted.
            The Verdict - most of the available opensource tables are not ready
            for agents - the industry is in a tech dept.
          </TodoItem>
          <TodoItem start={false}>
            <div class="text-left">
              <span class="badge badge-sm mb-2 -ml-2">Nov, 2025</span>
            </div>
            The goal is to build a portable but higly flexible component. There
            are several use cases to implement, but at this stage the focus is
            on core engine features: plugin system, grouping, editing, feedback
            flows.
          </TodoItem>
          <TodoItem start>
            <div class="text-right">
              <span class="badge badge-sm mb-2 -mr-2">Dec, 2025</span>
            </div>
            Aplha release target. The first goal is to integrate vski table with
            the backend (this table is only a part of the work). The second goal
            is to implement basic agentic flows.
          </TodoItem>
          <TodoItem start={false}>
            <div class="text-left">
              <span class="badge badge-sm mb-2 -ml-2">Jan, 2026</span>
            </div>
            More plugins.
          </TodoItem>
        </ul>
      </div>
    </div>
  );
}
