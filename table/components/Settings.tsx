import { useEffect, useRef } from "preact/hooks";
import { CommonRendererCallback, TableStore } from "@/module/types.ts";
import EyeIcon from "lucide-react/dist/esm/icons/eye.js";
import EyeClosedIcon from "lucide-react/dist/esm/icons/eye-closed.js";
import CogIcon from "lucide-react/dist/esm/icons/cog.js";
import XIcon from "lucide-react/dist/esm/icons/x.js";
import { Select } from "@/common/Select.tsx";
import { StyleSettings } from "@/styling/components/StyleSettings.tsx";
import { PxSlider } from "./PxSlider.tsx";

type TableSettingsProps = {
  store: TableStore;
};

export const Settings = ({ store }: TableSettingsProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (store.state.table.settings_dialog.value) {
      dialogRef.current?.showModal();
    }
  }, [store.state.table.settings_dialog.value]);

  return (
    <dialog ref={dialogRef} class="modal modal-end">
      <div class="modal-box rounded-none">
        <form
          class="absolute right-1 top-1"
          method="dialog"
          onSubmit={() => {
            store.state.table.settings_dialog.value = false;
          }}
        >
          <button type="submit" class="btn btn-ghost btn-circle">
            <XIcon />
          </button>
        </form>
        <h3 class="font-bold text-lg flex gap-3 items-center w-full">
          <CogIcon /> Table Settings
        </h3>

        <div class="modal-body mt-6 w-100">
          <Select
            options={[{ label: "System Font", value: "" }]}
            onChange={() => {
            }}
            value=""
          />

          <StyleSettings
            store={store}
            scope="table"
            className="border border-gray-200 dark:border-gray-700 rounded-md mt-6"
          />

          <PxSlider
            title="Header height"
            value={store.state.columns.header_height.value?.toString()}
            onInput={(value) => {
              store.state.columns.header_height.value = value;
            }}
          />

          <PxSlider
            title="Row height"
            value={store.state.table.row_height.value?.toString()}
            onInput={(value) => {
              store.state.table.row_height.value = value;
            }}
          />
        </div>
      </div>
      <form
        class="modal-backdrop"
        method="dialog"
        onSubmit={() => {
          store.state.table.settings_dialog.value = false;
        }}
      >
        <button type="submit"></button>
      </form>
    </dialog>
  );
};

export const renderTableSettings: CommonRendererCallback = ({ store }) => {
  return <Settings store={store} />;
};
