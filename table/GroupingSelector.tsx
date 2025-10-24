import { Signal } from "@preact/signals";

interface GroupingSelectorProps {
  allColumns: string[];
  selectedGroups: Signal<string[]>;
}

export function GroupingSelector(
  { allColumns, selectedGroups }: GroupingSelectorProps,
) {
  const toggleGroup = (column: string) => {
    const currentGroups = selectedGroups.value;
    if (currentGroups.includes(column)) {
      selectedGroups.value = currentGroups.filter((c) => c !== column);
    } else {
      selectedGroups.value = [...currentGroups, column];
    }
  };

  return (
    <div class="p-4 bg-base-200 rounded-box shadow-lg">
      <h3 class="text-lg font-bold mb-2">Group By</h3>
      <div class="flex flex-col gap-2">
        {allColumns.map((column) => (
          <label key={column} class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={selectedGroups.value.includes(column)}
              onChange={() =>
                toggleGroup(column)}
            />
            <span class="label-text">{column}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
