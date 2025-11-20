import { ContextMenuItem } from "@/ctxmenu/types.ts";
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

const CELL_STYLE_PARENT = "cell_style_parent";
export const CellParentMenu: ContextMenuItem = {
  menu: CELL_STYLE_PARENT,
  visibility: ({ column, rowId }) => !!column && !!rowId,
  title: () => <Title>Styling</Title>,
  label: () => <Item>Style</Item>,
  action() {},
};

export const RowMenu: ContextMenuItem = {
  menu: "row_style",
  parent: CELL_STYLE_PARENT,
  order: 1,
  highlight: (ctx) => `[data-row-id="${ctx.rowId}"] td`,
  visibility: ({ placement, rowId }) => !!rowId && placement !== "header",
  title: () => <Title>Row style</Title>,
  label: () => <Item>Row</Item>,
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
  order: 1,
  visibility: ({ placement, column }) => !!column && placement === "header",
  highlight: ({ column }) => `td[data-column-name="${column}"]`,
  title: () => <Title>Style</Title>,
  label: () => <Item>Style</Item>,
  action() {},
};

export const ColumnMenuCell: ContextMenuItem = {
  ...ColumnMenu,
  menu: "col_style_cell",
  order: 2,
  parent: CELL_STYLE_PARENT,
  visibility: () => true,
  label: () => <Item>Column</Item>,
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

export const ColumnMenuCellContent: ContextMenuItem = {
  ...ColumnMenuContent,
  menu: "col_style_menu_cell",
  parent: "col_style_cell",
};

export const CellMenu: ContextMenuItem = {
  menu: "cell_style",
  parent: CELL_STYLE_PARENT,
  visibility: ({ column, rowId }) => !!column && !!rowId,
  title: () => <Title>Cell style</Title>,
  label: () => <Item>Cell</Item>,
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
  CellParentMenu,
  RowMenu,
  RowMenuContent,
  ColumnMenu,
  ColumnMenuCell,
  ColumnMenuContent,
  ColumnMenuCellContent,
  CellMenu,
  CellMenuContent,
];
