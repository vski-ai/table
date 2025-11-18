import { signal, useSignal } from "@preact/signals";
import {
  MutableRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "preact/hooks";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { TableStore } from "@/module/types.ts";
import { CommonRendererCallback } from "@/module/types.ts";
import { MenuContext, MenuItem } from "./types.ts";
import BackIcon from "lucide-react/dist/esm/icons/chevron-left.js";
import { useMenuPlacement } from "./hooks/useMenuPlacement.ts";

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
  const context = useSignal<MenuContext>({ store });
  const placements = useMenuPlacement({ store });

  let highlightTarget: HTMLElement | null = null;
  const highlightTargets = useRef<string[]>([]);
  const highlight = useCallback((item: MenuItem) => {
    const h = item.highlight?.(context.value);
    if (h) {
      highlightTargets.current.push(h);
      document.querySelectorAll(h).forEach((el) => {
        el.classList.add("ctx-hightlight");
      });
    }
  }, []);

  const deHightlight = useCallback((item?: MenuItem) => {
    const h = item?.highlight?.(context.value);
    if (h) highlightTargets.current.push(h);
    highlightTargets.current.forEach((h) => {
      document.querySelectorAll(h).forEach((el) => {
        el.classList.remove("ctx-hightlight");
      });
    });
    highlightTargets.current.splice(0, highlightTargets.current.length);
  }, []);

  const clearHT = () => {
    document.querySelectorAll(".ctx-target").forEach((e) => {
      e.classList.remove("ctx-target");
    });
  };

  useLayoutEffect(() => {
    //clearHT()
    const handleContextMenu = (e: MouseEvent) => {
      clearHT();
      const target = e.target as HTMLTableCellElement;
      const place = placements.find((p) => p.match(e.target as HTMLElement));
      const placement = place?.name;
      if (!placement) {
        return;
      }

      e.preventDefault();
      highlightTarget = place.target(e.target! as HTMLElement) ||
        highlightTarget;
      const ctx = {
        column: target.closest("td")?.dataset.columnName ??
          target.closest("th")?.dataset.columnName,
        rowId: target.closest("tr")?.dataset.rowId,
        index: target.closest("tr")?.dataset.index,
        tabIndex: target.closest("td")?.tabIndex,
        placement,
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
      const rootMenu = store.state.context_menu.menu.value;
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
      setTimeout(() => menuRef.current?.focus());
      highlightTarget?.classList.add("ctx-target");
      contextMenuOpacity.value = 0;
    };

    const handleClickOutside = (e: MouseEvent) => {
      highlightTarget?.classList.remove("ctx-target");
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
        contextMenuOpacity.value = 0.1;
      }
      deHightlight();
    };

    const box = target?.current || document.body;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          close();
          clearHT();
          contextMenuOpacity.value = 0.1;
          break;
      }
    };

    box.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      box.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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

  const orderedKeys = useRef<string[]>([]);
  useEffect(() => {
    orderedKeys.current = "qwertasdfgzxcvyuiophjklbnm".toLocaleUpperCase()
      .split("");
  }, [
    currentMenu,
    contextMenuState.value.isOpen,
    contextMenuState.value.history,
    target,
  ]);

  if (!contextMenuState.value.isOpen || !currentMenu) {
    return null;
  }

  return (
    <>
      <div
        ref={menuRef}
        style={{
          left: contextMenuState.value.position.x,
          top: contextMenuState.value.position.y,
          opacity: contextMenuOpacity.value,
        }}
        class="vt-menu"
        tabIndex={0}
        onKeyPress={(ev) => {
          (ev.currentTarget.querySelector(
            `[data-kbd=${ev.key.toUpperCase()}]`,
          ) as HTMLButtonElement)?.click();
        }}
      >
        {isSubmenu && (
          <div class="vt-menu-title">
            <button
              type="button"
              onClick={(e) => {
                pop(e);
                menuRef.current?.focus();
              }}
            >
              <BackIcon />
            </button>
            {currentMenu.title?.(context.value)}
          </div>
        )}
        <ul>
          {currentMenu.items.map((item: MenuItem, index: number) => (
            !item.visibility(context.value) ? null : (
              item.action
                ? (
                  <li key={index} class="relative">
                    <button
                      type="button"
                      class="p-2 ctx-menu-item"
                      data-menu-index={index}
                      data-kbd={orderedKeys.current.at(0)}
                      tabIndex={0}
                      onMouseEnter={() => highlight(item)}
                      onFocus={() => highlight(item)}
                      onBlur={() => deHightlight(item)}
                      onMouseLeave={() => deHightlight(item)}
                      onKeyDown={(ev) => {
                        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
                          ev.preventDefault();
                          ev.stopPropagation();
                          const next = (ev.currentTarget.parentNode
                            ?.nextSibling as HTMLLIElement)?.querySelector(
                              "button.ctx-menu-item",
                            ) as HTMLButtonElement;
                          const prev = (ev.currentTarget.parentNode
                            ?.previousSibling as HTMLLIElement)
                            ?.querySelector(
                              "button.ctx-menu-item",
                            ) as HTMLButtonElement;
                          if (ev.key === "ArrowUp") {
                            prev?.focus();
                            return;
                          }
                          if (ev.key === "ArrowDown") {
                            next?.focus();
                          }
                        }
                      }}
                      onClick={(e) => {
                        deHightlight();
                        e.preventDefault();
                        e.stopPropagation();
                        if (item.submenu?.items?.length) {
                          push(item.submenu);
                          menuRef.current?.focus();
                        } else if (item.action) {
                          item.action(context.value);
                          close();
                        }
                      }}
                    >
                      {item.label(context.value)}
                      <small class="kbd" style={{ fontSize: ".7em" }}>
                        {orderedKeys.current.shift()}
                      </small>
                    </button>
                  </li>
                )
                : item.label(context.value)
            )
          ))}
        </ul>
      </div>
    </>
  );
}

export const contextMenuRenderCallback: CommonRendererCallback = (
  { store, ref },
) => {
  return <ContextMenu store={store} target={ref} />;
};
