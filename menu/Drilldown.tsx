import { useSignal } from "@preact/signals";
import { TableStore } from "@/store/mod.ts";
import { DrilldownDisplay } from "./DrilldownDisplay.tsx";
import { DrilldownEditor } from "./DrilldownEditor.tsx";

interface DrilldownProps {
  store: TableStore;
}

export function Drilldown({ store }: DrilldownProps) {
  const isEditorOpen = useSignal(false);

  const openEditor = () => {
    isEditorOpen.value = true;
  };

  const closeEditor = () => {
    isEditorOpen.value = false;
  };

  return (
    <>
      <div id="drilldown-display-target">
        <DrilldownDisplay store={store} onEditClick={openEditor} />
      </div>
      {isEditorOpen.value && (
        <DrilldownEditor
          store={store}
          onClose={closeEditor}
          openSignal={isEditorOpen}
        />
      )}
    </>
  );
}
