import { ContextMenuItem } from "@/contextmenu/types.ts";
import PaletteIcon from "lucide-react/dist/esm/icons/palette.js";

import { StyleSettings } from "./components/StyleSettings.tsx";
import { ComponentChildren } from "preact";

const Title = ({ children }: { children: ComponentChildren }) => {
  return (
    <div class="vt-fmt-menu-title">
      {children}
      <PaletteIcon />
    </div>
  );
};

const Item = ({ children }: { children: ComponentChildren }) => {
  return (
    <>
      <PaletteIcon />
      {children}
    </>
  );
};

export const RowMenu: ContextMenuItem = {
  menu: "row_style",
  visibility: ({ placement, tabIndex, rowId }) =>
    !!rowId && tabIndex === 0 && placement !== "outside",
  title: () => <Title>Row style</Title>,
  label: () => <Item>Row style</Item>,
  action() {},
};

export const RowMenuContent: ContextMenuItem = {
  menu: "row_style_menu",
  parent: "row_style",
  visibility: () => true,
  label: ({ store, rowId }) => (
    <>
      <StyleSettings store={store} scope="row" row={rowId!} />
    </>
  ),
};

export const ColumnMenu: ContextMenuItem = {
  menu: "col_style",
  visibility: ({ placement, column }) => !!column && placement === "outside",
  title: () => <Title>Column style</Title>,
  label: () => <Item>Column style</Item>,
  action() {},
};

export const ColumnMenuContent: ContextMenuItem = {
  menu: "col_style_menu",
  parent: "col_style",
  visibility: () => true,
  label: ({ store, column }) => (
    <>
      <StyleSettings store={store} scope="column" column={column!} />
    </>
  ),
};

export const CellMenu: ContextMenuItem = {
  menu: "cell_style",
  visibility: ({ column, rowId }) => !!column && !!rowId,
  title: () => <Title>Cell style</Title>,
  label: () => <Item>Cell style</Item>,
  action() {},
};

export const CellMenuContent: ContextMenuItem = {
  menu: "cell_style_menu",
  parent: "cell_style",
  visibility: () => true,
  label: ({ store, column, rowId }) => (
    <StyleSettings store={store} scope="cell" column={column!} row={rowId!} />
  ),
};

export const MenuItems = [
  RowMenu,
  RowMenuContent,
  ColumnMenu,
  ColumnMenuContent,
  CellMenu,
  CellMenuContent,
];
