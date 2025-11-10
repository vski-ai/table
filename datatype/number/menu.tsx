import { ContextMenuItem } from "@/contextmenu/types.ts";
import NumberIcon from "lucide-react/dist/esm/icons/decimals-arrow-left.js";
import { COLUMN_DATATYPE_MENU, Title } from "../menu.tsx";
import { Settings } from "./Settings.tsx";

export const NUMBER_DATATYPE_MENU = "column_datatype_number";

export const NumberDatatypeMenu: ContextMenuItem = {
  menu: NUMBER_DATATYPE_MENU,
  parent: COLUMN_DATATYPE_MENU,
  visibility: () => true,
  title: ({ column }) => (
    <Title>
      Number format{" "}
      <span class="badge badge-xs badge-accent absolute right-1">{column}</span>
    </Title>
  ),
  label: () => (
    <>
      <NumberIcon />
      <span>Number Format</span>
    </>
  ),
  action() {},
};

export const NumberSettingsMenu: ContextMenuItem = {
  menu: "number_settings_menu",
  parent: NUMBER_DATATYPE_MENU,
  visibility: () => true,
  label: (ctx) => <Settings {...ctx} />,
};

export const NumberMenuItems = [
  NumberDatatypeMenu,
  NumberSettingsMenu,
];
