import { ContextMenuItem } from "@/contextmenu/types.ts";
import { COLUMN_DATATYPE_MENU, Title } from "../menu.tsx";
import { Settings } from "./Settings.tsx";

export const DATE_DATATYPE_MENU = "column_datatype_date";

export const DateDatatypeMenu: ContextMenuItem = {
  menu: DATE_DATATYPE_MENU,
  parent: COLUMN_DATATYPE_MENU,
  visibility: () => true,
  title: ({ column }) => <Title>Number {column}</Title>,
  label: ({ store, column }) => (
    <>
      <span>Datetime Format</span>
    </>
  ),
  action() {},
};

export const DateSettingsMenu: ContextMenuItem = {
  menu: "date_settings_menu",
  parent: DATE_DATATYPE_MENU,
  visibility: () => true,
  label: (ctx) => <Settings {...ctx} />,
};

export const DateMenuItems = [
  DateDatatypeMenu,
  DateSettingsMenu,
];
