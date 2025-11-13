import { useEffect, useRef } from "preact/hooks";
import { CommonRendererCallback, TableStore } from "@/module/types.ts";
import EyeIcon from "lucide-react/dist/esm/icons/eye.js";
import EyeClosedIcon from "lucide-react/dist/esm/icons/eye-closed.js";
import CogIcon from "lucide-react/dist/esm/icons/columns-3-cog.js";
import { useOrderedColumns } from "../hooks/useOrderedColumns.ts";
import { useColumnsOrderCallback } from "../hooks/useColumnsOrderCallback.ts";
import { Draggable } from "@/common/Draggable.tsx";

type ColumnsManagerProps = {
  store: TableStore;
};

export function ColumnsManager({ store }: ColumnsManagerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (store.state.columns.manager_dialog.value) {
      dialogRef.current?.showModal();
    }
  }, [store.state.columns.manager_dialog.value]);

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
    <dialog ref={dialogRef} className="modal modal-end">
      <div className="modal-box rounded-none">
        <form
          class="absolute right-1 top-1"
          method="dialog"
          onSubmit={() => {
            store.state.columns.manager_dialog.value = false;
          }}
        >
          <button type="submit" className="btn btn-ghost">x</button>
        </form>
        <h3 className="font-bold text-lg flex gap-3 items-center w-full">
          <CogIcon /> Manage columns
        </h3>

        <div class="modal-body mt-6">
          {columns.map((column) => (
            <Draggable onDrop={onColumnDrop} id={column}>
              <div class="card p-2 mt-1 flex flex-row justify-between bg-base-300 cursor-move">
                <input
                  type="text"
                  class="input border-none outline-none shadow-none"
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
          store.state.columns.manager_dialog.value = false;
        }}
      >
        <button type="submit"></button>
      </form>
    </dialog>
  );
}

export const renderColumnsManager: CommonRendererCallback = ({ store }) => {
  return <ColumnsManager store={store} />;
};
