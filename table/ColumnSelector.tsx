import { Signal } from "@preact/signals";
import { Draggable } from "./Draggable.tsx";

interface ColumnManagerProps {
  allColumns: string[];
  selectedColumns: Signal<string[]>;
  formatColumnName?: (a: string) => string;
}

export function ColumnSelector(
  { allColumns, selectedColumns, formatColumnName }: ColumnManagerProps,
) {
  const handleCheckboxChange = (column: string, isChecked: boolean) => {
    const currentSelection = selectedColumns.value;
    let newSelection: string[];

    if (isChecked) {
      newSelection = [...currentSelection, column];
    } else {
      newSelection = currentSelection.filter((c) => c !== column);
    }

    // Filter 'allColumns' to preserve the original order.
    selectedColumns.value = allColumns.filter((c) => newSelection.includes(c));
  };

  const onDrop = (draggedId: string, targetId: string) => {
    const newColumns = [...selectedColumns.value];
    const draggedIndex = newColumns.indexOf(draggedId);
    const targetIndex = newColumns.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    selectedColumns.value = newColumns;
  };

  return (
    <ul
      tabIndex={0}
      class="menu flex-row p-2 mt-4 shadow-lg bg-base-100 border font-bold rounded-box max-w-64 max-h-96 overflow-y-auto overflow-x-hidden"
    >
      {allColumns.map((column, _) => {
        const formattedName = formatColumnName?.(column) ?? column;
        return (
          <Draggable onDrop={onDrop} id={column}>
            <li key={column} class="w-full">
              <label class="label cursor-pointer w-full flex justify-between">
                <span
                  class="label-text truncate max-w-52"
                  title={formattedName}
                >
                  {formattedName}
                </span>
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  checked={selectedColumns.value.includes(column)}
                  onChange={(e) =>
                    handleCheckboxChange(column, e.currentTarget.checked)}
                />
              </label>
            </li>
          </Draggable>
        );
      })}
    </ul>
  );
}
