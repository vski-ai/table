import { TableStore } from "@/store/mod.ts";

interface DrilldownDisplayProps {
  store: TableStore;
  onEditClick: () => void;
}

export function DrilldownDisplay(
  { store, onEditClick }: DrilldownDisplayProps,
) {
  const levels = store.state.drilldowns.value;

  if (!levels.length) {
    return (
      <div class="flex items-center">
        <button onClick={onEditClick} class="text-blue-500 hover:text-blue-700">
          + Add drilldown
        </button>
      </div>
    );
  }

  const firstLevel = levels[0];
  const lastLevel = levels[levels.length - 1];
  const middleLevelsCount = levels.length - 2;

  return (
    <div class="flex items-center" onClick={onEditClick}>
      <span class="text-gray-500">Drilldown:</span>
      <div class="flex items-center ml-2">
        <div class="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
          {firstLevel}
        </div>
        {middleLevelsCount > 0 && (
          <div class="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md ml-2">
            +{middleLevelsCount}
          </div>
        )}
        {levels.length > 1 && (
          <div class="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md ml-2">
            {lastLevel}
          </div>
        )}
      </div>
    </div>
  );
}
