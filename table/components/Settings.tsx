import { useEffect, useRef } from "preact/hooks";
import { CommonRendererCallback, TableStore } from "@/module/types.ts";
import CogIcon from "lucide-react/dist/esm/icons/cog.js";
import XIcon from "lucide-react/dist/esm/icons/x.js";
import { Select } from "@/common/Select.tsx";
import { StyleSettings } from "@/styling/components/StyleSettings.tsx";
import { PxSlider } from "./PxSlider.tsx";
import { useAddons } from "@/module/mod.ts";

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
  const addons = useAddons({ store });

  return (
    <dialog ref={dialogRef} class="modal modal-end">
      <div class="modal-box vt-settings">
        <form
          class="vt-settings-close"
          method="dialog"
          onSubmit={() => {
            store.state.table.settings_dialog.value = false;
          }}
        >
          <button type="submit">
            <XIcon />
          </button>
        </form>
        <h3 class="vt-settings-header">
          <CogIcon /> Table Settings
        </h3>

        <div class="modal-body vt-settings-body">
          {addons.beforesettings.render({ store })}

          <label class="vt-settings-label">
            Table Styles
          </label>

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

          {addons.aftersettings.render({ store })}
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
