import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Cell } from "./Cell.tsx";
import { RowData } from "@/row/types.ts";
import { createApp } from "@xmod/mod.ts";
import { modules } from "@/table/factory.tsx";

describe("Cell component", () => {
  it("should render a cell with the correct value", () => {
    const store = createApp({
      id: "test",
      modules,
    });
    const column = "col1";
    const row: RowData = { id: "row1", [column]: "Hello" };

    const { getByText } = render(
      <table>
        <tbody>
          <tr>
            <Cell store={store} column={column} row={row} />
          </tr>
        </tbody>
      </table>,
    );

    expect(getByText("Hello").textContent).toBe("Hello");
  });
});
