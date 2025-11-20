import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Column } from "./Column.tsx";
import { createTableModule, NoopStorageAdapter } from "@/module/mod.ts";

describe("Column component", () => {
  it("should render a column with the correct name", () => {
    const store = createTableModule({
      id: "test",
      modules: [],
      persistence: new NoopStorageAdapter(),
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
