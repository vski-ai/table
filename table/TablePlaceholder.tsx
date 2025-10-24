import { type Signal } from "@preact/signals";
import { type JSX } from "preact";

export function TablePlaceholder(
  { columns, selectedRows, renderExpandedRow }: {
    columns: string[];
    selectedRows?: Signal<any[]>;
    renderExpandedRow?: (row: any) => JSX.Element;
  },
) {
  return (
    <div class="overflow-x-auto">
      <table class="table w-full bg-base-100 table-bordered">
        <thead>
          <tr>
            {renderExpandedRow && (
              <th class="border border-base-300" style={{ width: "50px" }}></th>
            )}
            {selectedRows && (
              <th class="border border-base-300" style={{ width: "50px" }}>
                <div class="h-6 bg-base-300 animate-pulse rounded"></div>
              </th>
            )}
            {columns.map((col) => (
              <th key={col} class="border border-base-300">
                <div class="h-6 bg-base-300 animate-pulse rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }).map((_, i) => (
            <tr key={i}>
              {renderExpandedRow && (
                <td class="border border-base-300" style={{ width: "50px" }}>
                </td>
              )}
              {selectedRows && (
                <td class="border border-base-300" style={{ width: "50px" }}>
                  <div class="h-6 bg-base-300 animate-pulse rounded"></div>
                </td>
              )}
              {columns.map((col) => (
                <td key={col} class="border border-base-300">
                  <div class="h-6 bg-base-300 animate-pulse rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
