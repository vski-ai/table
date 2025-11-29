import { SortedAddon } from "@xmod/mod.ts";
import type {
  ClassResolverCallback,
  CommonRendererCallback,
  StyleResolverCallback,
} from "@/table/types.ts";
import type { CellRendererCallback } from "@/cell/types.ts";

declare module "@xmod/types.ts" {
  interface Slots extends RowSlots {
  }
}

type RowSlots = {
  rowPadding: {
    left: SortedAddon<CommonRendererCallback>;
    right: SortedAddon<CommonRendererCallback>;
  };
  row: {
    left: SortedAddon<CellRendererCallback>;
    right: SortedAddon<CellRendererCallback>;
    beforeEach: SortedAddon<CellRendererCallback>;
    afterEach: SortedAddon<CellRendererCallback>;
    classes: SortedAddon<ClassResolverCallback>;
    styles: SortedAddon<StyleResolverCallback>;
  };
};

export const slots = (): RowSlots => ({
  rowPadding: {
    left: new SortedAddon<CommonRendererCallback>(),
    right: new SortedAddon<CommonRendererCallback>(),
  },
  row: {
    left: new SortedAddon<CellRendererCallback>(),
    right: new SortedAddon<CellRendererCallback>(),
    beforeEach: new SortedAddon<CellRendererCallback>(),
    afterEach: new SortedAddon<CellRendererCallback>(),
    classes: new SortedAddon<ClassResolverCallback>(),
    styles: new SortedAddon<StyleResolverCallback>(),
  },
});
