import { getAddons, type Store } from "@xmod/mod.ts";
import { CommonRendererCallback } from "../types.ts";
import CogIcon from "lucide-react/dist/esm/icons/cog.js";
import { Select } from "@/common/Select.tsx";
import { StyleSettings } from "@/styling/components/StyleSettings.tsx";
import { PxSlider } from "./PxSlider.tsx";
import { Dialog } from "@/common/Dialog.tsx";

type TableSettingsProps = {
  store: Store;
};

export const Settings = ({ store }: TableSettingsProps) => {
  const addons = getAddons({ store });

  return (
    <Dialog
      isOpen={store.state.table.settings_dialog}
      icon={<CogIcon />}
      title="Table Settings"
      className="vt-settings"
      onClose={() => {
        store.state.table.settings_dialog.value = false;
      }}
    >
      <div class="vt-settings-body">
        {addons.beforesettings.render({ store })}

        <label class="vt-settings-label">Table Styles</label>

        <Select
          options={[{ label: "System Font", value: "" }]}
          onChange={() => {}}
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
    </Dialog>
  );
};

export const renderSettings: CommonRendererCallback = ({ store }) => {
  return <Settings store={store} />;
};
