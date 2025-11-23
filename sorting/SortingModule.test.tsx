import { describe, expect, it } from "vitest";
import { render } from "@testing-library/preact";
import { Column } from "@/columns/components/Column.tsx";
import { createApp } from "@xmod/mod.ts";
import { modules } from "@/table/factory.tsx";
import { SortingModule } from "./mod.ts";

describe("Sorter module", () => {
  it("should render a sorter in the column", async () => {
    const store = createApp({
      id: "test",
      modules: [...modules, SortingModule],
    });
    await new Promise((r) => setTimeout(r, 1));

    store.state.fetcher.table_meta.value = {
      ...store.state.fetcher.table_meta.value,
      sortable_columns: ["col1"],
    };

    const column = "col1";

    const { getByTestId } = render(
      <table>
        <thead>
          <tr>
            <Column store={store} column={column} />
          </tr>
        </thead>
      </table>,
    );
    expect(getByTestId("col1-sorter").className).toContain("vt-sorter");
  });
});
