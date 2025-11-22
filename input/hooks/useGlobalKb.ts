import { MutableRef, useEffect } from "preact/hooks";
import { TableStore } from "@/module/store/mod.ts";
import { CELL_SELECT_RESET, CellSelectResetCmd } from "@/cell/store.ts";

type Props = {
  store: TableStore;
  tableRef: MutableRef<HTMLTableElement | null>;
};

export function useGloalKb({ store, tableRef }: Props) {
  const altKey = store.state.keyboard.altKey;
  const metaKey = store.state.keyboard.metaKey;

  useEffect(() => {
    const globalKeyDown = (ev: KeyboardEvent) => {
      if (ev.altKey) {
        altKey.value = true;
      }
      if (ev.metaKey || ev.ctrlKey) {
        metaKey.value = true;
      }
      if (ev.key === "Escape") {
        store.dispatch<CellSelectResetCmd>({
          type: CELL_SELECT_RESET,
          payload: true,
        });
      }
    };
    const globalKeyUp = (ev: KeyboardEvent) => {
      if (!ev.altKey) {
        altKey.value = false;
      }
      if (!ev.metaKey && !ev.ctrlKey) {
        metaKey.value = false;
      }
    };

    globalThis.addEventListener("keydown", globalKeyDown);
    globalThis.addEventListener("keyup", globalKeyUp);
    return () => {
      globalThis.removeEventListener("keydown", globalKeyDown);
      globalThis.removeEventListener("keyup", globalKeyUp);
    };
  });

  useEffect(() => {
    const keyIntercept = () => {
      if (document.activeElement === document.body) {
        tableRef.current?.focus();
      }
    };
    globalThis.addEventListener("keyup", keyIntercept);
    return () => {
      globalThis.removeEventListener("keyup", keyIntercept);
    };
  }, [tableRef.current]);
}
