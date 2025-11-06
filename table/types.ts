import { type JSX } from "preact";
import { TableStore } from "@/store/types.ts";
import { PluginContainer } from "@/plugin/mod.ts";
import { MutableRef } from "preact/hooks";
import { DataLoadCallback } from "@/fetcher/types.ts";

export type VirtualTableViewProps = {
  onDataLoad: DataLoadCallback;
  store: TableStore;
  initialWidth?: number;
  rowHeight?: number;
  buffer?: number;
  scrollContainerRef: MutableRef<HTMLElement>;
  rowIdentifier?: string;
  enumerable?: boolean;
};

export interface Row extends Record<string, any> {
  id: string | number;
}
