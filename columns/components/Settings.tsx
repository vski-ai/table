import { useEffect, useRef } from "preact/hooks";
import { CommonRendererCallback, TableStore } from "@/module/types.ts";
import EyeIcon from "lucide-react/dist/esm/icons/eye.js";
import EyeClosedIcon from "lucide-react/dist/esm/icons/eye-closed.js";
import CogIcon from "lucide-react/dist/esm/icons/columns-3-cog.js";
import XIcon from "lucide-react/dist/esm/icons/x.js";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { useColumnsOrderCallback } from "../hooks/useColumnsOrderCallback.ts";
import { Draggable } from "@/common/Draggable.tsx";

type ColumnsSettingsProps = {
  store: TableStore;
};

export function Settings({ store }: ColumnsSettingsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (store.state.columns.settings_dialog.value) {
      dialogRef.current?.showModal();
    }
  }, [store.state.columns.settings_dialog.value]);

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
    <dialog ref={dialogRef} class="modal modal-end">
      <div class="modal-box rounded-none">
        <form
          class="absolute right-1 top-1"
          method="dialog"
          onSubmit={() => {
            store.state.columns.settings_dialog.value = false;
          }}
        >
          <button type="submit" class="btn btn-ghost btn-circle">
            <XIcon />
          </button>
        </form>
        <h3 class="font-bold text-lg flex gap-3 items-center w-full">
          <CogIcon /> Columns
        </h3>

        <div class="modal-body mt-6">
          {columns.map((column) => (
            <Draggable onDrop={onColumnDrop} id={column}>
              <div class="card p-2 mt-1 flex flex-row justify-between bg-base-300 cursor-move">
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
      </div>
      <form
        class="modal-backdrop"
        method="dialog"
        onSubmit={() => {
          store.state.columns.settings_dialog.value = false;
        }}
      >
        <button type="submit"></button>
      </form>
    </dialog>
  );
}

export const renderColumnSettings: CommonRendererCallback = ({ store }) => {
  return <Settings store={store} />;
};
