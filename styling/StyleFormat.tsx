import type { Store } from "@xmod/types.ts";
import type { CommonRendererCallback } from "@/table/mod.ts";

export interface StyleFormatProps {
  store: Store;
}

export function StyleFormat({ store }: StyleFormatProps) {
  const styles: string[] = [];
  const root = rootSelect(store.state.tableId! as string);

  const table = store.state.styles.table.value;
  let style = "";
  for (const [prop, value] of Object.entries(table)) {
    style += prop + ": " + value + ";";
  }
  style = root + `.vt-fmt {${style}}`;
  styles.push(style);

  const cols = store.state.styles.columns.value;
  for (const column in cols) {
    const col = cols[column];
    let style = "";
    for (const [prop, value] of Object.entries(col)) {
      style += prop + ": " + value + ";";
    }
    style = colSelect(root, column) + ` {${style}}`;
    styles.push(style);
  }

  const rows = store.state.styles.rows.value;
  for (const rowId in rows) {
    const row = rows[rowId];
    let style = "";
    for (const [prop, value] of Object.entries(row)) {
      style += prop + ": " + value + ";";
    }
    style = rowSelect(root, rowId) + ` {${style}}`;
    styles.push(style);
  }

  const cells = store.state.styles.cells.value;
  for (const rowId in cells) {
    const row = cells[rowId];
    for (const column in row) {
      const cell = row[column];
      let style = "";
      for (const [prop, value] of Object.entries(cell)) {
        style += prop + ": " + value + ";";
      }
      style = cellSelect(root, rowId, column) + ` {${style}}`;
      styles.push(style);
    }
  }

  return <style>{styles.join(" \n")}</style>;
}

export const renderStyleFormat: CommonRendererCallback = ({ store }) => {
  return <StyleFormat store={store} />;
};

const rootSelect = (id: string) => `table[x-id="vt_${id}"] `;
const rowSelect = (root: string, rowId: string) =>
  root + ` tr[data-row-id="${rowId}"] td .vt-fmt `;
const colSelect = (root: string, column: string) =>
  root + ` td[data-column-name="${column}"] .vt-fmt `;
const cellSelect = (root: string, rowId: string, column: string) =>
  root +
  ` tr[data-row-id="${rowId}"] td[data-column-name="${column}"] .vt-fmt `;
