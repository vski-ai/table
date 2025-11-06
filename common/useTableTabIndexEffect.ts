import { MutableRef, useEffect } from "preact/hooks";

type TabIndexEffectProps = {
  target: MutableRef<HTMLTableElement | null>;
};

// A side effect that sets correct tab indicies after the table updates.
// I've tried to pass tab indicies around and set them manually
// so far this is the best solution.
export function useTableTabIndexEffect(
  { target }: TabIndexEffectProps,
  dependencies: any[] = [],
) {
  useEffect(() => {
    const el = target.current;
    if (!el) {
      return;
    }

    const handler = setTimeout(() => {
      const rows = el.querySelectorAll<HTMLTableRowElement>("tbody tr");
      rows?.forEach((row) => {
        const cells = row.querySelectorAll<HTMLTableCellElement>("td");
        cells.forEach((cell, index) => {
          cell.tabIndex = index;
          cell.querySelectorAll("a, button, input, textarea").forEach((el) => {
            (el as HTMLAnchorElement).tabIndex = index;
          });
        });
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [target.current, ...dependencies]);
}
