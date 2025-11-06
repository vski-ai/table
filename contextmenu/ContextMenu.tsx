import { signal } from "@preact/signals";
import { MutableRef, useLayoutEffect, useRef } from "preact/hooks";
import { computePosition, flip, shift } from "@floating-ui/dom";
import { TableStore } from "@/store/types.ts";
import { CommonRendererCallback } from "../plugin/types.ts";

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

  useLayoutEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
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
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
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
      }}
      className="menu card border border-accent/25 shadow-lg p-3 bg-base-100 absolute z-100 transition-[top] duration-300 w-64"
    >
      <div className="flex items-center gap-2 mb-1">
        {isSubmenu && (
          <a href="#" class="btn btn-xs" onClick={pop}>
            Back
          </a>
        )}
        <p class="font-bold m-0!">{currentMenu.title}</p>
      </div>
      <ul>
        {currentMenu.items.map((item: any, index: number) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (item.submenu) {
                  push(item.submenu);
                } else if (item.action) {
                  item.action();
                  close();
                }
              }}
            >
              {item.icon}
              {item.label}
            </a>
          </li>
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
