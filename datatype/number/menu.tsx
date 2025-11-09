import { ContextMenuItem } from "@/contextmenu/types.ts";
import { COLUMN_DATATYPE_MENU, Title } from "../menu.tsx";
import { Settings } from "./Settings.tsx";

export const NUMBER_DATATYPE_MENU = "column_datatype_number";

export const NumberDatatypeMenu: ContextMenuItem = {
  menu: NUMBER_DATATYPE_MENU,
  parent: COLUMN_DATATYPE_MENU,
  visibility: () => true,
  title: ({ column }) => <Title>Number {column}</Title>,
  label: ({ store, column }) => (
    <>
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
