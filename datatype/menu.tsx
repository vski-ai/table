import { ContextMenuItem } from "@/ctxmenu/types.ts";
import NumberIcon from "lucide-react/dist/esm/icons/decimals-arrow-right.js";
import { ComponentChildren } from "preact";

export const COLUMN_DATATYPE_MENU = "column_datatype";

export const Title = ({ children }: { children: ComponentChildren }) => {
  return (
    <div class="vt-fmt-menu-title">
      {children}
      <NumberIcon />
    </div>
  );
};

const Item = ({ children }: { children: ComponentChildren }) => {
  return (
    <>
      <NumberIcon />
      {children}
    </>
  );
};

export const ColumnMenu: ContextMenuItem = {
  menu: COLUMN_DATATYPE_MENU,
  order: 0,
  visibility: ({ placement, column }) => !!column && placement === "outside",
  title: () => <Title>Data types</Title>,
  label: () => <Item>Data types</Item>,
  action() {},
};

export const MenuItems = [
  ColumnMenu,
];
