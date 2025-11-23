import { SortedAddon } from "@xmod/mod.ts";
import type { ClassResolverCallback } from "@/table/types.ts";

declare module "@xmod/types.ts" {
  interface Slots {
    columnclasses: SortedAddon<ClassResolverCallback>;
    columnattributes: SortedAddon;
  }
}

export const slots = () => ({
  columnclasses: new SortedAddon<ClassResolverCallback>(),
  columnattributes: new SortedAddon(),
});
