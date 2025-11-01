import { AsideSwitch } from "./navbar/AsideSwitch.tsx";
import { AsideFold } from "./navbar/AsideFold.tsx";
import { ThemeSwitch } from "./navbar/ThemeSwitch.tsx";

import UserIcon from "lucide-react/dist/esm/icons/user.js";
import FolderKeyIcon from "lucide-react/dist/esm/icons/folder-key.js";
import LayoutDashboardIcon from "lucide-react/dist/esm/icons/layout-dashboard.js";
import PlugZapIcon from "lucide-react/dist/esm/icons/plug-zap.js";
import ChartIcon from "lucide-react/dist/esm/icons/chart-column-increasing.js";

import { ui } from "./state.ts";

export default function ({ children }: { children: any }) {
  return (
    <>
      <nav class="main-navbar">
        <AsideSwitch />
        <div class="flex-1" />
      </nav>
      <main className="flex min-w-full w-fit bg-base-300">
        <aside className="main-aside">
          <div class="h-12"></div>
          <ul className="main-aside-menu">
            <li>
              <a href="/app" class="aria-[current=page]:active">
                <LayoutDashboardIcon />
                Dashboard
              </a>
            </li>
            <li>
              <a href="/app/reports" class="aria-[current=page]:active">
                <ChartIcon />
                Reports
              </a>
              <ul class="dense:ml-0 dense:pl-0">
                <li>
                  <a href="/app/sources" class="aria-[current=page]:active">
                    <PlugZapIcon />
                    Event Sources
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/app/keys" class="aria-[current=page]:active">
                <FolderKeyIcon />
                API Keys
              </a>
            </li>
          </ul>
          <div className="main-aside-bottom">
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
        <section className="main-outlet">
          {children}
        </section>
      </main>
    </>
  );
}
