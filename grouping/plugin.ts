import {
  AfterLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { CommandType } from "../columns/store.ts";
import { groupCellRenderCallback } from "./GroupCell.tsx";
import { groupHeaderRenderCallback } from "./GroupColumn.tsx";

export const groupingPlugin = (): ITablePlugin => {
  const onInit: PluginInitCallback = ({
    store,
    leftTableCells,
    leftTableHeaders,
    rowClasses,
    rowStyles,
  }) => {
    leftTableHeaders.use(0, groupHeaderRenderCallback);

    leftTableCells.use(0, groupCellRenderCallback);

    rowClasses.use(1, ({ row }) => {
      return [row?.$is_group_root ? "vt-g-row" : "vt-row"];
    });

    rowStyles.use(1, ({ row }) => {
      return [
        ["--group-level", row?.$group_level ?? 0],
      ];
    });

    store.dispatch({
      type: CommandType.COLUMN_VISIBILITY_SET,
      payload: {
        $is_group_root: false,
        $group_level: false,
        $group_by: false,
      },
    });
  };

  const afterLoad: AfterLoadCallback = ({ res, store }) => {
    store.dispatch({
      type: CommandType.COLUMN_VISIBILITY_SET,
      payload: res.meta?.groupby?.reduce((acc, column) => ({
        ...acc,
        [column]: false,
      }), {}) ?? {},
    });
    return res;
  };

  return {
    name: "grouping",
    onInit,
    afterLoad,
  };
};
