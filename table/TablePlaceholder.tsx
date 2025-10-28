import { type Signal } from "@preact/signals";
import { type JSX } from "preact";

interface TablePlaceholderProps {
  columns: string[];
  selectedRows?: Signal<any[]>;
  renderExpand?: (row: any) => JSX.Element;
}

export function TablePlaceholder(
  { columns, selectedRows, renderExpand }: TablePlaceholderProps,
) {
  return (
    <div class="overflow-x-auto">
      <table class="table w-full bg-base-100 table-bordered">
        <thead>
          <tr>
            {renderExpand && (
              <th
                style={{ width: "60px" }}
                class="vski-expanded-row-th"
              >
              </th>
            )}
            {selectedRows && (
              <th
                style={{ width: "60px" }}
                class="vski-select-row-th"
              >
                <div class="h-6 w-6 bg-base-300 rounded-md"></div>
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
          {[...Array(10)].map((_, i) => (
            <tr key={i}>
              {renderExpand && (
                <td class="p-4">
                  <div class="h-6 w-6 bg-base-300 rounded-md"></div>
                </td>
              )}
              {selectedRows && (
                <td class="p-4">
                  <div class="h-6 w-6 bg-base-300 rounded-md"></div>
                </td>
              )}
              {columns.map((col) => (
                <td key={col} class="p-4">
                  <div class="h-6 bg-base-300 rounded-md"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
