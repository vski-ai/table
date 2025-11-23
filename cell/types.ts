import type { Addon, ClassResolverCallback } from "@/module/types.ts";

declare module "@/module/types.ts" {
  interface ModuleInitOptions {
    columnclasses: Addon<ClassResolverCallback>;
  }
}
