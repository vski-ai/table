import { cloneElement, TargetedDragEvent } from "preact";
import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { TableStore } from "@/module/store/mod.ts";

interface DraggableProps {
  children: ComponentChildren;
  onTransfer?: (draggedId: string, targetId: string) => void;
  id: string;
  store: TableStore;
}

export const Draggable = ({
  children,
  onTransfer,
  id,
  store,
}: DraggableProps) => {
  const dragOver = useSignal(false);
  const globalActive = store.state.drag.active;

  const onDragStart = (e: TargetedDragEvent<HTMLElement>) => {
    globalActive.value = true;
    e?.dataTransfer?.setData("text/plain", id);
  };

  const onDragEnd = (e: TargetedDragEvent<HTMLElement>) => {
    e.stopImmediatePropagation();
    globalActive.value = false;
  };

  const onDragOver = (e: TargetedDragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    dragOver.value = true;
  };

  const onDragLeave = (e: TargetedDragEvent<HTMLElement>) => {
    e.stopImmediatePropagation();
    dragOver.value = false;
  };

  const handleOnDrop = (e: TargetedDragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    globalActive.value = false;
    dragOver.value = false;
    const draggedId = e?.dataTransfer?.getData("text/plain");
    onTransfer?.(draggedId!, id);
  };
  return cloneElement(children as any, {
    draggable: true,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop: handleOnDrop,
    style: {
      border: dragOver.value ? "2px dashed #ccc" : "2px solid transparent",
    },
  });
};
