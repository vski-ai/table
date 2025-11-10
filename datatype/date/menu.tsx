import { ContextMenuItem } from "@/contextmenu/types.ts";
import { COLUMN_DATATYPE_MENU, Title } from "../menu.tsx";
import { Settings } from "./Settings.tsx";
import CalendarIcon from "lucide-react/dist/esm/icons/calendar-clock.js";

export const DATE_DATATYPE_MENU = "column_datatype_date";

export const DateDatatypeMenu: ContextMenuItem = {
  menu: DATE_DATATYPE_MENU,
  parent: COLUMN_DATATYPE_MENU,
  visibility: () => true,
  title: ({ column }) => (
    <Title>
      Date format{" "}
      <span class="badge badge-xs badge-accent absolute right-1">{column}</span>
    </Title>
  ),
  label: () => (
    <>
      <CalendarIcon />
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
