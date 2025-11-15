import { AsideSwitch } from "./navbar/AsideSwitch.tsx";
import { AsideFold } from "./navbar/AsideFold.tsx";
import { ThemeSwitch } from "./navbar/ThemeSwitch.tsx";

import HomeIcon from "lucide-react/dist/esm/icons/home.js";
import LayoutDashboardIcon from "lucide-react/dist/esm/icons/table-properties.js";
import PlugZapIcon from "lucide-react/dist/esm/icons/plug-zap.js";
import ChartIcon from "lucide-react/dist/esm/icons/table-2.js";
import { VskiTableLogo } from "./icons/VskiTableLogo.tsx";

import { ui } from "./state.ts";

export default function ({ children }: { children: any }) {
  return (
    <>
      <nav class="main-navbar flex">
        <AsideSwitch />
        <div class="w-32 flex absolute left-18 -top-200 dense:-top-200 aside-open:top-3.5 transition-all">
          <VskiTableLogo />
        </div>
      </nav>
      <main class="flex min-w-full w-fit bg-base-300">
        <aside class="main-aside opacity-40 hover:opacity-100 transition-opacity duration-400">
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
              <a href="/flat" class="aria-[current=page]:active">
                <LayoutDashboardIcon />
                Core tables
              </a>
            </li>
            <li class="pointer-events-none opacity-50">
              <a
                aria-disabled="true"
                href="#"
                class="aria-[current=page]:active disabled"
              >
                <PlugZapIcon />
                Plugins
                <span class="badge badge-xs badge-accent absolute dense:hidden">
                  soon
                </span>
              </a>
            </li>
            <li class="pointer-events-none opacity-50">
              <a
                aria-disabled="true"
                href="#"
                class="aria-[current=page]:active disabled"
              >
                <ChartIcon />
                Grouped tables
                <span class="badge badge-xs badge-accent absolute dense:hidden">
                  soon
                </span>
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
                <span class="badge badge-xs badge-accent absolute dense:hidden">
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
        <section class="main-outlet">
          {children}
        </section>
      </main>
    </>
  );
}
