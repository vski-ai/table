import { useCallback } from "preact/hooks";

interface RowResizeHandleProps {
  rowId: string | number;
  onResize: (rowId: string | number, height: number) => void;
  onResizeEnd: () => void;
  rowHeight: number;
}

export function RowResizeHandle(
  { rowId, onResize, onResizeEnd, rowHeight }: RowResizeHandleProps,
) {
  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const startHeight = rowHeight;

    const onMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight + (e.clientY - startY);
      if (newHeight > 30) { // Minimum height
        onResize(rowId, newHeight);
      }
    };

    const onMouseUp = () => {
      onResizeEnd();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [rowId, onResize, onResizeEnd, rowHeight]);

  return (
    <div
      class="vt-row-resize-handle"
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "5px",
        cursor: "row-resize",
      }}
    />
  );
}
