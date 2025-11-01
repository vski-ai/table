import { signal, useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { ColumnMenu } from "./ColumnMenu.tsx";
import ArrowLeftIcon from "lucide-react/dist/esm/icons/arrow-left.js";
import SettingsIcon from "lucide-react/dist/esm/icons/settings.js";
import { TableStore } from "@/store/types.ts";
import { RefObject } from "preact/compat";

type ActiveMenu = "main" | "columnSettings";

interface ContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  context: { type: string; data?: any } | null;
  activeMenu: ActiveMenu;
}

interface ContextMenuProps {
  store: TableStore;
  target?: RefObject<HTMLElement>;
}

const MENU_WIDTH = "300px";

export function ContextMenu({
  store,
  target,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const lastTarget = useRef<HTMLElement>(null);

  const contextMenuState = useSignal<ContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0,
    context: null,
    activeMenu: "main",
  });

  const { x, y, context, isVisible, activeMenu } = contextMenuState.value;

  useEffect(() => {
    const positionMenu = async () => {
      const { x: x2, y: y2 } = await computePosition(
        {
          getBoundingClientRect: () => ({
            width: 0,
            height: 0,
            x: x,
            y: y,
            top: y,
            left: x,
            right: x,
            bottom: y,
          }),
          contextElement: lastTarget.current!,
        },
        menuRef.current!,
        {
          placement: "top-start",
          middleware: [shift(), flip()],
        },
      );
      contextMenuState.value = {
        ...contextMenuState.value,
        x: x2,
        y: y2,
      };
    };

    if (activeMenu !== "main") {
      positionMenu();
    }

    const handleContextMenu = async (event: MouseEvent) => {
      event.preventDefault();

      await new Promise((r) => setTimeout(r));

      let context: { type: string; data?: any } = { type: "unknown" };
      const target = event.target as HTMLElement;
      lastTarget.current = target;
      const cellElement = target.closest("td");
      const headerElement = target.closest("th");
      const rowElement = target.closest("tr");
      const tableElement = target.closest("table");

      if (headerElement) {
        const columnName = headerElement.dataset.columnName;
        context = { type: "header", data: { columnName } };
      } else if (cellElement) {
        const columnName = cellElement.dataset.columnName;
        const rowId = rowElement?.dataset.rowId;
        context = {
          type: "cell",
          data: { rowId, columnName, value: cellElement.textContent },
        };
      } else if (rowElement) {
        const rowId = rowElement.dataset.rowId;
        context = { type: "row", data: { rowId } };
      } else if (tableElement) {
        context = { type: "table" };
      }

      console.log("Context Menu Clicked:", context);

      // Create a virtual element for @floating-ui
      const virtualElement = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: event.clientX,
          y: event.clientY,
          top: event.clientY,
          left: event.clientX,
          right: event.clientX,
          bottom: event.clientY,
        }),
        contextElement: target,
      };

      if (menuRef.current) {
        const { x, y } = await computePosition(
          virtualElement,
          menuRef.current,
          {
            placement: "top-start",
            middleware: [flip(), shift()],
          },
        );

        contextMenuState.value = {
          ...contextMenuState.value,
          isVisible: true,
          x,
          y,
          context: context,
          activeMenu: "main",
        };
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        contextMenuState.value = {
          ...contextMenuState.value,
          isVisible: false,
          activeMenu: "main",
        };
      }
    };

    const box = target?.current || document.body;

    box.addEventListener("contextmenu", handleContextMenu);
    box.addEventListener("click", handleClickOutside);

    return () => {
      box.removeEventListener("contextmenu", handleContextMenu);
      box.removeEventListener("click", handleClickOutside);
    };
  }, [target, activeMenu]);

  const menuClasses = [
    "absolute z-50 bg-base-300 shadow-lg rounded-box p-2 border border-accent/10",
    isVisible
      ? "opacity-100 scale-100"
      : "opacity-0 scale-95 pointer-events-none",
  ].join(" ");

  return (
    <div
      ref={menuRef}
      className={menuClasses}
      style={{
        top: y,
        left: x,
        width: MENU_WIDTH,
      }}
    >
      {activeMenu === "main" && (
        <ul className="menu menu-compact bg-base-300 rounded-box w-56">
          <li>
            <a>Action 1 ({context?.type})</a>
          </li>
          {context?.type === "header" || context?.type === "cell"
            ? (
              <li>
                <a
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation to prevent immediate closing
                    contextMenuState.value = {
                      ...contextMenuState.value,
                      activeMenu: "columnSettings",
                    };
                  }}
                >
                  <SettingsIcon style={{ width: 16, height: 16 }} />
                  Column Settings
                </a>
              </li>
            )
            : null}
          <li>
            <a>Action 2</a>
          </li>
          <li>
            <a>Action 3</a>
          </li>
        </ul>
      )}

      {activeMenu === "columnSettings" &&
        (context?.type === "header" || context?.type === "cell") && (
        <div className="p-2">
          <button
            type="button"
            class="btn btn-sm btn-ghost mb-2"
            onClick={(ev) => {
              ev.stopPropagation();
              contextMenuState.value = {
                ...contextMenuState.value,
                activeMenu: "main",
              };
            }}
          >
            <ArrowLeftIcon style={{ width: 16, height: 16 }} />
            Back
          </button>
          <ColumnMenu column={context.data.columnName} store={store} />
        </div>
      )}
    </div>
  );
}
