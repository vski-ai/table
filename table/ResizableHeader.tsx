import { type JSX } from "preact";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Draggable } from "./Draggable.tsx";

export interface ResizableHeaderProps {
  column: string;
  width: number;
  extensions?: (col: string) => JSX.Element;
  action?: (col: string) => JSX.Element;
  onResize: (column: string, newWidth: number) => void;
  onResizeUpdate: (column: string, newWidth: number) => void;
  onColumnDrop?: (draggedColumn: string, targetColumn: string) => void;
  formatColumnName?: (a: string) => string;
  stickyColumns: {
    left: Record<string, number>;
    right: Record<string, number>;
  };
  children?: any;
}

export function ResizableHeader(
  {
    column,
    width,
    onResize,
    onResizeUpdate,
    extensions,
    action,
    onColumnDrop,
    formatColumnName,
    children,
    stickyColumns,
  }: ResizableHeaderProps,
) {
  const isResizing = useSignal(false);
  const startX = useSignal(0);
  const startWidth = useSignal(0);
  const edit = useSignal(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const formattedName = formatColumnName?.(column) ?? column;

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
        onResizeUpdate(column, newWidth);
      }
    };

    const handleMouseUp = (moveEvent: MouseEvent) => {
      isResizing.value = false;
      const newWidth = startWidth.value + (moveEvent.clientX - startX.value);
      onResize(column, newWidth > 50 ? newWidth : 50);
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

  const isStickyLeft = typeof stickyColumns.left[column] === "number";
  const isStickyRight = typeof stickyColumns.right[column] === "number";

  return (
    <th
      style={{
        width: `${width}px`,
        left: isStickyLeft ? stickyColumns.left[column] : undefined,
        right: isStickyRight ? stickyColumns.right[column] : undefined,
        zIndex: isStickyLeft || isStickyRight ? 100 : 10,
        position: isStickyLeft || isStickyRight ? "sticky" : undefined,
      }}
      id={`column-header-${column}`}
    >
      <Draggable onDrop={onColumnDrop} id={column}>
        {children ? children : (
          <div class="flex justify-start items-center">
            {action?.(column)}
            {!edit.value
              ? (
                <div
                  class="truncate p-1 min-w-32 w-full"
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
              {extensions?.(column)}
            </div>
          </div>
        )}
      </Draggable>
      <div
        class="absolute -right-2 top-0 h-full w-4 cursor-col-resize select-none bg-transparent"
        onMouseDown={handleMouseDown}
      />
    </th>
  );
}
