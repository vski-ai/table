import { signal, useSignal } from "@preact/signals";
import { MutableRef, useLayoutEffect, useRef } from "preact/hooks";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { TableStore } from "@/module/types.ts";
import { CommonRendererCallback } from "@/module/types.ts";
import { MenuContext, MenuItem } from "./types.ts";
import BackIcon from "lucide-react/dist/esm/icons/chevron-left.js";

interface ContextMenuProps {
  store: TableStore;
  target?: MutableRef<HTMLElement>;
}

const contextMenuState = signal({
  isOpen: false,
  virtualElement: null as any,
  history: [] as any[],
  position: { x: 0, y: 0 },
});

const useContextMenu = () => {
  const open = (menu: any, virtualElement: any) => {
    contextMenuState.value = {
      ...contextMenuState.value,
      isOpen: true,
      virtualElement,
      history: [menu],
    };
  };

  const close = () => {
    contextMenuState.value = {
      ...contextMenuState.value,
      isOpen: false,
      history: [],
    };
  };

  const push = (menu: any) => {
    contextMenuState.value = {
      ...contextMenuState.value,
      history: [...contextMenuState.value.history, menu],
    };
  };

  const pop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    contextMenuState.value = {
      ...contextMenuState.value,
      history: contextMenuState.value.history.slice(0, -1),
    };
  };

  return { open, close, push, pop };
};

export function ContextMenu({ store, target }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { open, close, push, pop } = useContextMenu();

  const currentMenu = contextMenuState.value.history.length > 0
    ? contextMenuState.value.history[contextMenuState.value.history.length - 1]
    : null;
  const isSubmenu = contextMenuState.value.history.length > 1;
  const contextMenuOpacity = useSignal(0);
  const context = useSignal<MenuContext>({ store, placement: "outside" });

  useLayoutEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLTableCellElement;

      const ctx = {
        column: target.closest("td")?.dataset.columnName ??
          target.closest("th")?.dataset.columnName,
        rowId: target.closest("tr")?.dataset.rowId,
        index: target.closest("tr")?.dataset.index,
        tabIndex: target.closest("td")?.tabIndex,
        placement: (!target.closest("td") ? "outside" : "body") as any,
        store,
      };
      if (
        Object.values({ ...ctx, store: undefined, placement: undefined }).every(
          (e) => !e,
        )
      ) {
        return;
      }
      context.value = ctx;
      const rootMenu = store.state.contextMenu.value;
      const virtualElement = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: e.clientX,
          y: e.clientY,
          top: e.clientY,
          left: e.clientX,
          right: e.clientX,
          bottom: e.clientY,
        }),
      };

      open(rootMenu, virtualElement);
      contextMenuOpacity.value = 0;
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
        contextMenuOpacity.value = 0.1;
      }
    };

    const box = target?.current || document.body;

    box.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);

    return () => {
      box.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [target]);

  useLayoutEffect(() => {
    if (
      contextMenuState.value.isOpen && menuRef.current &&
      contextMenuState.value.virtualElement
    ) {
      computePosition(contextMenuState.value.virtualElement, menuRef.current, {
        placement: "top-start",
        middleware: [shift({ crossAxis: true }), flip()],
      }).then(({ x, y }) => {
        contextMenuState.value = {
          ...contextMenuState.value,
          position: { x, y },
        };
        contextMenuOpacity.value = 1;
      });
    }
  }, [
    contextMenuState.value.isOpen,
    contextMenuState.value.virtualElement,
    contextMenuState.value.history,
  ]);

  if (!contextMenuState.value.isOpen || !currentMenu) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      style={{
        left: contextMenuState.value.position.x,
        top: contextMenuState.value.position.y,
        opacity: contextMenuOpacity.value,
      }}
      className="vt-menu"
    >
      {isSubmenu && (
        <div className="vt-menu-title">
          <a href="#" onClick={pop}>
            <BackIcon />
          </a>
          {currentMenu.title?.(context.value)}
        </div>
      )}
      <ul>
        {currentMenu.items.map((item: MenuItem, index: number) => (
          !item.visibility(context.value) ? null : (
            item.action
              ? (
                <li key={index} class="relative">
                  <a
                    href="#"
                    class="p-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.submenu?.items?.length) {
                        push(item.submenu);
                      } else if (item.action) {
                        item.action(context.value);
                        close();
                      }
                    }}
                  >
                    {item.label(context.value)}
                  </a>
                </li>
              )
              : item.label(context.value)
          )
        ))}
      </ul>
    </div>
  );
}

export const contextMenuRenderCallback: CommonRendererCallback = (
  { store, ref },
) => {
  return <ContextMenu store={store} target={ref} />;
};
