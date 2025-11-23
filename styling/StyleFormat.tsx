import { Store } from "@xmod/types.ts";
import { CommonRendererCallback } from "@xmod/mod.ts";

const ROOT_SEL = (id: string) => `table[x-id="vt_${id}"] `;
const ROW_SEL = (root: string, rowId: string) =>
  root + ` tr[data-row-id="${rowId}"] td .vt-fmt `;
const COL_SEL = (root: string, column: string) =>
  root + ` td[data-column-name="${column}"] .vt-fmt `;
const CELL_SEL = (root: string, rowId: string, column: string) =>
  root +
  ` tr[data-row-id="${rowId}"] td[data-column-name="${column}"] .vt-fmt `;

export interface StyleFormatProps {
  store: Store;
}

export function StyleFormat({ store }: StyleFormatProps) {
  const styles: string[] = [];
  const root = ROOT_SEL(store.state.tableId!);

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
    style = COL_SEL(root, column) + ` {${style}}`;
    styles.push(style);
  }

  const rows = store.state.styles.rows.value;
  for (const rowId in rows) {
    const row = rows[rowId];
    let style = "";
    for (const [prop, value] of Object.entries(row)) {
      style += prop + ": " + value + ";";
    }
    style = ROW_SEL(root, rowId) + ` {${style}}`;
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
      style = CELL_SEL(root, rowId, column) + ` {${style}}`;
      styles.push(style);
    }
  }

  return <style>{styles.join(" \n")}</style>;
}

export const renderStyleFormat: CommonRendererCallback = ({ store }) => {
  return <StyleFormat store={store} />;
};
