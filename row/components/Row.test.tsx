import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Row } from "./Row.tsx";
import { createApp } from "@xmod/mod.ts";
import { modules } from "@/table/factory.tsx";
import { RowData } from "@/row/types.ts";

describe("Row component", () => {
  it("should render a row with the correct cells", () => {
    const store = createApp({
      id: "test",
      modules,
    });
    const row: RowData = { id: "row1", col1: "Cell 1", col2: "Cell 2" };

    const { getByText } = render(
      <table>
        <tbody>
          <Row
            store={store}
            row={row}
            rowIndex={0}
            rowHeight={42}
            columns={["col1", "col2"]}
            rowKey="id"
          />
        </tbody>
      </table>,
    );

    expect(getByText("Cell 1").textContent).toBe("Cell 1");
    expect(getByText("Cell 2").textContent).toBe("Cell 2");

    const rowEl = getByText("Cell 1").closest("tr")!;
    expect(rowEl.dataset.index).toBe("0");
    expect(rowEl.dataset.rowId).toBe("row1");
  });
});
