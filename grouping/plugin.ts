import {
  AfterLoadCallback,
  BeforeLoadCallback,
  ITablePlugin,
  PluginInitCallback,
} from "@/plugin/mod.ts";
import { ColumnVisibilityCommand } from "../columns/store.ts";
import { groupCellRenderCallback } from "./GroupCell.tsx";
import { groupColumnRenderCallback } from "./GroupColumn.tsx";

const onInit: PluginInitCallback = ({
  store,
  lefttablecells,
  lefttableheaders,
  rowclasses,
  rowstyles,
}) => {
  lefttableheaders.use(0, groupColumnRenderCallback);
  lefttablecells.use(0, groupCellRenderCallback);

  rowclasses.use(1, ({ row }) => {
    return [row?.$is_group_root ? "vt-g-row" : "vt-row"];
  });

  rowstyles.use(1, ({ row }) => {
    return [
      ["--group-level", row?.$group_level ?? 0],
    ];
  });

  store.dispatch<ColumnVisibilityCommand>({
    type: "COLUMN_VISIBILITY_SET",
    payload: {
      $is_group_root: false,
      $group_level: false,
      $group_by: false,
      $parent_id: false,
    },
  });
};

const beforeLoad: BeforeLoadCallback = ({ options, store }) => {
  options.groupBy = store.state.groupBy.value;
  return options;
};

const afterLoad: AfterLoadCallback = ({ res, store }) => {
  store.dispatch<ColumnVisibilityCommand>({
    type: "COLUMN_VISIBILITY_SET",
    payload: res.meta?.groupBy.reduce((acc, column) => ({
      ...acc,
      [column]: false,
    }), {}) ?? {},
  });
  return res;
};

export const GroupingPlugin: ITablePlugin = {
  name: "grouping",
  onInit,
  beforeLoad,
  afterLoad,
};
