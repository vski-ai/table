import { ComponentChildren } from "preact";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "@/common/className.ts";
import { usePlugins } from "@/plugin/mod.ts";
import { TableStore } from "@/store/types.ts";
import { Draggable } from "@/common/Draggable.tsx";
import { useColumnsOrderCallback } from "../hooks/useColumnsOrderCallback.ts";
import { useColumnResizer } from "../hooks/useColumnnResize.ts";
import { useStickyColumn } from "../hooks/useStickyColumn.ts";

export interface ColumnProps {
  column: string;
  store: TableStore;
  children?: ComponentChildren;
}

export function Column(
  {
    column,
    children,
    store,
  }: ColumnProps,
) {
  const plugins = usePlugins({ store });
  const onColumnDrop = useColumnsOrderCallback({ store });
  const {
    getColumnWidth,
    handleResizeUpdateCallback,
    handleResizeCallback,
  } = useColumnResizer({
    store,
  });

  const width = getColumnWidth(column);
  const isResizing = useSignal(false);
  const startX = useSignal(0);
  const startWidth = useSignal(0);
  const edit = useSignal(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO: needs i18n and fromatters
  const formattedName = column;

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isResizing.value = true;
    startX.value = e.clientX;
    startWidth.value = width;
  };

  useEffect(() => {
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth.value + (moveEvent.clientX - startX.value);
      if (newWidth > 50) { // Minimum column width
        handleResizeUpdateCallback(column, newWidth);
      }
    };

    const handleMouseUp = (moveEvent: MouseEvent) => {
      isResizing.value = false;
      const newWidth = startWidth.value + (moveEvent.clientX - startX.value);
      handleResizeCallback(column, newWidth > 50 ? newWidth : 50);
    };

    if (isResizing.value) {
      globalThis.addEventListener("mousemove", handleMouseMove);
      globalThis.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
      globalThis.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing.value]);

  const { left, right, isSticky, isStickyLeft, isStickyRight } =
    useStickyColumn({ store, column });

  return (
    <th
      data-column-name={column}
      style={{
        width: `${width}px`,
        left,
        right,
        zIndex: isSticky ? 100 : 10,
        position: isSticky ? "sticky" : undefined,
      }}
      id={`column-header-${column}`}
      class={cn({
        "vt-col": true,
        "stick-left": isStickyLeft,
        "stick-right": isStickyRight,
      })}
    >
      <Draggable onDrop={onColumnDrop} id={column}>
        {children ? children : (
          <div class="vt-col-wrap">
            {plugins.headerprefixes.render({
              column,
              store,
            })}
            {!edit.value
              ? (
                <div
                  class="vt-col-content"
                  title={formattedName}
                  onDblClick={() => {
                    edit.value = true;
                    setTimeout(() => {
                      inputRef.current?.focus();
                    });
                  }}
                >
                  {formattedName}
                </div>
              )
              : (
                <input
                  autoFocus
                  autoComplete="off"
                  type="text"
                  value={formattedName}
                  ref={inputRef}
                  onFocusOut={() => {
                    edit.value = false;
                  }}
                  onKeyUp={(ev) => {
                    if (ev.key === "Enter") {
                      edit.value = false;
                    }
                    if (ev.key === "esc") {
                      edit.value = false;
                    }
                  }}
                />
              )}
            <div class="ml-2">
            </div>
          </div>
        )}
      </Draggable>
      <div
        class="vt-col-resize"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
}
