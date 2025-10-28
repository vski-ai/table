import { TableStore } from "@/store/mod.ts";
import { CommandType } from "@/store/commands.ts";

interface DrilldownProps {
  store: TableStore;
}

export function Drilldown({ store }: DrilldownProps) {
  const { drilldowns } = store.state;

  const removeDrilldown = (drilldown: string) => {
    const newDrilldowns = drilldowns.value.filter((d) => d !== drilldown);
    store.dispatch({ type: CommandType.DRILLDOWN_SET, payload: newDrilldowns });
  };

  return (
    <div class="p-4 bg-base-200 rounded-box shadow-lg">
      <h3 class="text-lg font-bold mb-2">Drilldowns</h3>
      <div class="flex flex-wrap gap-2">
        {drilldowns.value.map((drilldown) => (
          <div key={drilldown} class="badge badge-lg">
            {drilldown}
            <button
              class="btn btn-xs btn-circle btn-ghost ml-2"
              onClick={() =>
                removeDrilldown(drilldown)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
