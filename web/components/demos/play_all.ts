import { MutableRef } from "preact/hooks";
import { delay, end, scrollX, scrollY, start } from "./common.ts";
import { TableStore } from "@/module/types.ts";
import { navigation } from "./navigation.ts";

export async function playAll(
  store: TableStore,
  scrollContainer: MutableRef<HTMLElement>,
) {
  if (!scrollContainer.current) {
    return;
  }
  start();
  store.state.columnWidths.value = {
    $$enumerator$$: 50,
  };
  store.state.rowHeights.value = {};
  store.state.stickyColumns.value = {};
  store.state.columnStyles.value = {};
  store.state.rowStyles.value = {};
  store.state.cellDataTypes.value = {};
  store.state.columnDataType.value = {};
  store.state.columnDataTypeOptions.value = {};
  delay(1000);

  // Scroll to the end
  const maxScroll = scrollContainer.current.scrollWidth -
    scrollContainer.current.clientWidth;
  await scrollX(scrollContainer.current, maxScroll, 2000);
  await delay(1000);

  store.dispatch({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      Total: 500,
    },
  });

  await delay(600);

  store.dispatch({
    type: "COLUMN_WIDTHS_SET",
    payload: {
      Total: 150,
    },
  });

  await scrollX(scrollContainer.current, 500, 2000);
  await scrollX(scrollContainer.current, maxScroll - 100, 2000);
  await delay(1000);
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    Total: "right",
  };

  await delay(1000);
  store.state.columnDataTypeOptions.value = {
    ...store.state.columnDataTypeOptions.value,
    Total: {
      "minimumFractionDigits": 3,
      "maximumFractionDigits": 3,
      "locale": "en-US",
      "style": "currency",
      "currencyDisplay": "symbol",
      "currency": "USD",
    },
  };

  store.state.columnDataType.value = {
    ...store.state.columnDataType.value,
    Total: "currency",
  };

  await delay(1000);
  store.state.columnStyles.value = {
    ...store.state.columnStyles.value,
    Total: {
      "font-style": "italic",
    },
  };
  await delay(1000);
  store.state.columnStyles.value = {
    ...store.state.columnStyles.value,
    Total: {
      "font-weight": "bold",
    },
  };
  await delay(1000);
  await scrollX(scrollContainer.current, 0, 2000);
  await delay(1000);

  store.state.columnDataTypeOptions.value = {
    ...store.state.columnDataTypeOptions.value,
    "Order Date": {
      "locale": "en-GB",
      "dateStyle": "medium",
      "timeStyle": "medium",
    },
  };
  store.state.columnDataType.value = {
    ...store.state.columnDataType.value,
    "Order Date": "date",
  };

  await delay(1000);
  store.state.columnStyles.value = {
    ...store.state.columnStyles.value,
    "Order Date": {
      "font-style": "italic",
    },
  };

  await delay(1000);

  store.state.columnStyles.value = {
    ...store.state.columnStyles.value,
    "Order Date": {
      "font-style": "italic",
    },
  };

  await delay(1000);

  store.state.columnStyles.value = {
    ...store.state.columnStyles.value,
    "Product Name": {
      "font-weight": "bold",
    },
  };

  await delay(1000);
  store.state.stickyColumns.value = {
    ...store.state.stickyColumns.value,
    "Product Name": "left",
  };

  await delay(1000);
  await scrollX(scrollContainer.current, maxScroll / 2, 2000);

  await delay(1000);
  store.state.columnDataTypeOptions.value = {
    ...store.state.columnDataTypeOptions.value,
    Price: {
      "minimumFractionDigits": 2,
      "maximumFractionDigits": 2,
      "locale": "en-US",
      "style": "currency",
      "currencyDisplay": "symbol",
      "currency": "USD",
    },
    Discount: {
      "minimumFractionDigits": 2,
      "maximumFractionDigits": 2,
      "locale": "en-US",
      "style": "currency",
      "currencyDisplay": "symbol",
      "currency": "USD",
    },
  };
  store.state.columnDataType.value = {
    ...store.state.columnDataType.value,
    Price: "currency",
    Discount: "currency",
  };

  await delay(1000);

  store.state.rowStyles.value = {
    ...store.state.rowStyles.value,
    "summary-123": {
      "color": "#ff9200",
      "text-align": "left",
      "text-decoration": "none",
      "font-style": "italic",
      "font-weight": "bold",
      "font-size": "0.7em",
    },
  };
  store.dispatch({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "summary-123": 30,
    },
  });
  await delay(1000);

  store.dispatch({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "1": 500,
    },
  });

  await delay(1000);

  store.dispatch({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "1": 64,
    },
  });

  await delay(1000);

  store.dispatch({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "3": 200,
    },
  });

  await delay(1000);

  store.dispatch({
    type: "ROW_HEIGHTS_SET",
    payload: {
      "3": 78,
    },
  });

  await delay(2000);

  scrollContainer.current!.scrollTop = 20000;
  await delay(1000);
  await scrollY(scrollContainer.current!, 16200, 800);
  await delay(1000);
  await Promise.all([
    scrollY(scrollContainer.current!, 0, 1000),
    scrollX(scrollContainer.current!, 0, 1000),
  ]);
  await delay(1000);
  await navigation();

  end();
}
