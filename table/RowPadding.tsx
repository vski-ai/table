import { forwardRef } from "preact/compat";

interface RowPaddingProps {
  columns: string[];
  tableAddon: any;
  expandable?: boolean;
  selectable?: boolean;
  groupable?: boolean;
  enumerable?: boolean;
  getColumnWidth: (col: string) => number;
  padding: number;
  name: string;
}

export const RowPadding = forwardRef<HTMLTableRowElement, RowPaddingProps>((
  {
    columns,
    expandable,
    selectable,
    groupable,
    enumerable,
    getColumnWidth,
    padding,
    tableAddon,
    name,
  },
  ref,
) => {
  return (
    <tr data-name={name} ref={ref} style={{ height: `${padding}px` }}>
      {enumerable && (
        <td style={{ width: "50px", height: 0, border: 0, padding: 0 }}>
        </td>
      )}
      {expandable && (
        <td style={{ width: "50px", height: 0, border: 0, padding: 0 }}>
        </td>
      )}
      {selectable && (
        <td style={{ width: "50px", height: 0, border: 0, padding: 0 }}>
        </td>
      )}
      {groupable && (
        <td
          style={{
            width: getColumnWidth("$group_by"),
            height: 0,
            border: 0,
            padding: 0,
          }}
        >
        </td>
      )}
      {columns.map((col) => (
        <td
          style={{
            width: getColumnWidth(col),
            height: 0,
            border: 0,
            padding: 0,
          }}
        >
        </td>
      ))}
      {tableAddon
        ? (
          <td
            style={{
              height: 0,
              border: 0,
              padding: 0,
              width: "80px",
            }}
          >
          </td>
        )
        : null}
    </tr>
  );
});
