import type { Store } from "@xmod/types.ts";
import type { CommonRendererCallback } from "@/table/types.ts";
import EyeIcon from "lucide-react/dist/esm/icons/eye.js";
import EyeClosedIcon from "lucide-react/dist/esm/icons/eye-closed.js";
import CogIcon from "lucide-react/dist/esm/icons/columns-3-cog.js";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { useColumnsOrderCallback } from "../hooks/useColumnsOrderCallback.ts";
import { Draggable } from "@/input/components/Draggable.tsx";
import { Dialog } from "@/common/Dialog.tsx";

type ColumnsSettingsProps = {
  store: Store;
};

export function Settings({ store }: ColumnsSettingsProps) {
  const columns = useOrderedColumns({ store, visibility: false });
  const onColumnDrop = useColumnsOrderCallback({ store });

  const toggleVisibility = (column: string) => () => {
    store.state.columns.visibility.value[column] = !store.state.columns
      .visibility.value[column];
    store.state.columns.visibility.value = {
      ...store.state.columns.visibility.value,
    };
  };

  return (
    <Dialog
      isOpen={store.state.columns.settings_dialog}
      onClose={() => {
        store.state.columns.settings_dialog.value = false;
      }}
      title="Columns"
      icon={<CogIcon />}
    >
      <div class="modal-body mt-6">
        {columns.map((column) => (
          <Draggable store={store} onTransfer={onColumnDrop} id={column}>
            <div class="card p-2 mt-1 flex flex-row justify-between bg-sky-950 cursor-move">
              <input
                type="text"
                class="input border-none outline-none shadow-none bg-transparent"
                value={column}
              />
              <button
                type="button"
                onClick={toggleVisibility(column)}
                class="btn btn-md btn-ghost"
              >
                {store.state.columns.visibility.value[column] !== false
                  ? <EyeIcon />
                  : <EyeClosedIcon />}
              </button>
            </div>
          </Draggable>
        ))}
      </div>
    </Dialog>
  );
}

export const renderColumnSettings: CommonRendererCallback = ({ store }) => {
  return <Settings store={store} />;
};
