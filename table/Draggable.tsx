import { cloneElement, JSX } from "preact";
import { useSignal } from "@preact/signals";

interface DraggableProps {
  children: JSX.Element;
  onDrop?: (draggedId: string, targetId: string) => void;
  id: string;
}

export const Draggable = ({ children, onDrop, id }: DraggableProps) => {
  const dragOver = useSignal(false);

  const handleDragStart = (e: JSX.TargetedDragEvent<HTMLElement>) => {
    e?.dataTransfer?.setData("text/plain", id);
  };

  const handleDragOver = (e: JSX.TargetedDragEvent<HTMLElement>) => {
    e.preventDefault();
    dragOver.value = true;
  };

  const handleDragLeave = () => {
    dragOver.value = false;
  };

  const handleDrop = (e: JSX.TargetedDragEvent<HTMLElement>) => {
    e.preventDefault();
    dragOver.value = false;
    const draggedId = e?.dataTransfer?.getData("text/plain");
    onDrop?.(draggedId!, id);
  };
  return cloneElement(children, {
    draggable: true,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    style: {
      border: dragOver.value ? "2px dashed #ccc" : "2px solid transparent",
    },
  });
};
