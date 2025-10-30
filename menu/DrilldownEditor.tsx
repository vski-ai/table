import { TableStore } from "@/store/mod.ts";
import { CommandType } from "@/store/commands.ts";
import { useMemo, useState } from "preact/hooks";
import { XYModal } from "./XYModal.tsx";
import { Signal } from "@preact/signals";

interface DrilldownEditorProps {
  store: TableStore;
  onClose: () => void;
  openSignal: Signal<boolean>;
}

export function DrilldownEditor(
  { store, onClose, openSignal }: DrilldownEditorProps,
) {
  const [levels, setLevels] = useState(store.state.drilldowns.value);
  const [newLevel, setNewLevel] = useState("");

  const availableColumns = useMemo(() => {
    return store.state.columnOrder.value.filter((col) => !levels.includes(col));
  }, [store.state.columnOrder.value, levels]);

  const suggestions = useMemo(() => {
    if (!newLevel) {
      return [];
    }
    return availableColumns.filter((col) =>
      col.toLowerCase().includes(newLevel.toLowerCase())
    );
  }, [newLevel, availableColumns]);

  const handleRemoveLevel = (level: string | number) => {
    setLevels(levels.filter((l) => l !== level));
  };

  const handleAddLevel = (level: string) => {
    if (level && !levels.includes(level)) {
      setLevels([...levels, level]);
      setNewLevel("");
    }
  };

  const handleSave = () => {
    store.dispatch({ type: CommandType.DRILLDOWN_SET, payload: levels });
    onClose();
  };

  return (
    <XYModal target="#drilldown-display-target" openSignal={openSignal}>
      <div class="drilldown-editor">
        <div class="drilldown-editor-header">
          <h2 class="drilldown-editor-title">Edit Drilldown</h2>
          <button onClick={onClose} class="drilldown-editor-close">
            Close
          </button>
        </div>
        <div class="drilldown-editor-levels">
          {levels.map((level) => (
            <div key={level} class="drilldown-editor-level">
              <span>{level}</span>
              <button
                onClick={() =>
                  handleRemoveLevel(level)}
                class="drilldown-editor-level-remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div class="drilldown-editor-add">
          <input
            type="text"
            value={newLevel}
            onInput={(e) => setNewLevel(e.currentTarget.value)}
            class="drilldown-editor-input"
            placeholder="Add a new level"
          />
          {suggestions.length > 0 && (
            <ul class="drilldown-editor-suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleAddLevel(suggestion)}
                  class="drilldown-editor-suggestion"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div class="drilldown-editor-footer">
          <button onClick={onClose} class="drilldown-editor-cancel">
            Cancel
          </button>
          <button onClick={handleSave} class="drilldown-editor-save">
            Save
          </button>
        </div>
      </div>
    </XYModal>
  );
}
