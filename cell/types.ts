import type { Addon } from "@xmod/types.ts";
import type { ClassResolverCallback } from "@/table/types.ts";

declare module "@xmod/types.ts" {
  interface Slots {
    columnclasses: Addon<ClassResolverCallback>;
  }
}
