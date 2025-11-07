import { ColumnWidthCommand } from "@/columns/store.ts";
import { RowHeightCommand } from "@/enumerator/store.ts";
import { delay, end, start } from "./common.ts";
import { TableStore } from "@/store/types.ts";

export async function resizableColumns(store: TableStore) {
  start();

  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      id: 500,
    },
  });

  await delay(500);

  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      id: 250,
    },
  });

  await delay();

  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      "Last Name": 500,
    },
  });

  await delay();

  store.dispatch<ColumnWidthCommand>({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      "Last Name": 150,
    },
  });

  await delay();

  end();
}

export async function resizableRows(store: TableStore) {
  start();

  store.dispatch<RowHeightCommand>({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "1": 500,
    },
  });

  await delay();

  store.dispatch<RowHeightCommand>({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "1": 64,
    },
  });

  await delay();

  store.dispatch<RowHeightCommand>({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "3": 200,
    },
  });

  await delay();

  store.dispatch<RowHeightCommand>({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "3": 78,
    },
  });

  await delay(500);

  end();
}
