import { AsideSwitch } from "./navbar/AsideSwitch.tsx";
import { AsideFold } from "./navbar/AsideFold.tsx";
import { ThemeSwitch } from "./navbar/ThemeSwitch.tsx";

import HomeIcon from "lucide-react/dist/esm/icons/home.js";
import KanbanIcon from "lucide-react/dist/esm/icons/kanban.js";
import TableIcon from "lucide-react/dist/esm/icons/table.js";
import PenIcon from "lucide-react/dist/esm/icons/pen.js";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.js";
import CombineIcon from "lucide-react/dist/esm/icons/combine.js";
import PlugZapIcon from "lucide-react/dist/esm/icons/plug-zap.js";
import ChartIcon from "lucide-react/dist/esm/icons/table-2.js";
import { VskiTableLogo } from "./icons/VskiTableLogo.tsx";

import { ui } from "./state.ts";

function AiBadge() {
  return (
    <span class="text-white badge badge-xs bg-blue-500 border-none absolute dense:hidden">
      <span class="text-white badge badge-xs bg-sky-700 border-none -ml-3">
        ai
      </span>
      $
    </span>
  );
}

export default function ({ children }: { children: any }) {
  return (
    <>
      <nav class="main-navbar flex">
        <AsideSwitch />
        <div class="w-32 flex items-center h-8 absolute left-18 -top-200 dense:-top-200 aside-open:top-3.5 transition-all">
          <VskiTableLogo className="w-32" />
        </div>
      </nav>
      <main class="flex min-w-full w-fit bg-base-300">
        <aside class="main-aside opacity-40 hover:opacity-100 transition-opacity duration-800">
          <div class="h-12"></div>
          <ul class="main-aside-menu">
            <li>
              <a href="/" class="aria-[current=page]:active mt-10">
                <HomeIcon />
                Home
              </a>
            </li>
            <li>
              <div class="divider"></div>
            </li>
            <li class="p-8">
              They don't need documentation - they've got AI. We'll write it
              anyway. Not for them but for AI.
            </li>
            <li>
              <div class="divider"></div>
            </li>
            <li>
              <a href="/core" class="aria-[current=page]:active">
                <TableIcon />
                Grid Engine{" "}
                <span class="badge badge-xs border-none text-white bg-sky-500 absolute dense:hidden w-11">
                  free
                </span>
              </a>
            </li>
            <li>
              <a href="/flat" class="aria-[current=page]:active">
                <PenIcon />
                Edit Mode <AiBadge />
              </a>
            </li>
            <li>
              <a
                aria-disabled="true"
                href="/group-columns"
                class="aria-[current=page]:active"
              >
                <CombineIcon />
                Col Group
                <AiBadge />
              </a>
            </li>
            <li>
              <a href="/groupable" class="aria-[current=page]:active">
                <ChartIcon />
                Tree Engine
                <AiBadge />
              </a>
            </li>
            <li>
              <a
                aria-disabled="true"
                href="/kanban"
                class="aria-[current=page]:active"
              >
                <KanbanIcon />
                Kanban
                <AiBadge />
              </a>
            </li>

            <li class="pointer-events-none opacity-50">
              <a
                aria-disabled="true"
                href="#"
                class="aria-[current=page]:active disabled"
              >
                <WorkflowIcon />
                Workflows
                <AiBadge />
              </a>
            </li>
            <li class="pointer-events-none opacity-50">
              <a
                aria-disabled="true"
                href="#"
                class="aria-[current=page]:active disabled"
              >
                <PlugZapIcon />
                Agentic flows
                <span class="badge badge-xs badge-accent border-none text-white w-11 absolute dense:hidden">
                  soon
                </span>
              </a>
            </li>
          </ul>
          <div class="main-aside-bottom">
            {
              /* <a
              href="/app/profile"
              class="btn btn-ghost btn-circle"
              aria-label="Profile"
            >
              <UserIcon style={{ width: "24px", height: "24px" }} />
            </a> */
            }
            <AsideFold />
            <ThemeSwitch theme={ui.value.theme!} />
          </div>
        </aside>
        <section class="main-outlet">{children}</section>
      </main>
    </>
  );
}
