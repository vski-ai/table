import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Column } from "./Column.tsx";
import { createApp } from "@xmod/mod.ts";
import { modules } from "@/table/factory.tsx";

describe("Column component", () => {
  it("should render a column with the correct name", () => {
    const store = createApp({
      id: "test",
      modules,
    });
    const column = "col1";

    const { getByText } = render(
      <table>
        <thead>
          <tr>
            <Column store={store} column={column} />
          </tr>
        </thead>
      </table>,
    );
    expect(getByText("col1").closest("th")?.dataset.columnName).toBe(column);
  });
});
