import { useEffect } from "preact/hooks";
import { TableStore } from "@/module/store/mod.ts";

type Props = {
  store: TableStore;
};

export function useGloalMouse({ store }: Props) {
  const dragActive = store.state.drag.active;
  const mousePressed = store.state.mouse.pressed;
  useEffect(() => {
    if (dragActive.value) {
      mousePressed.value = false;
    }
    const globalMouseDown = () => {
      if (dragActive.value) return;
      mousePressed.value = true;
    };

    const globalMouseUp = () => {
      mousePressed.value = false;
    };

    globalThis.addEventListener("mousedown", globalMouseDown);
    globalThis.addEventListener("mouseup", globalMouseUp);
    return () => {
      globalThis.removeEventListener("mousedown", globalMouseDown);
      globalThis.removeEventListener("mouseup", globalMouseUp);
    };
  }, [dragActive.value]);
}
