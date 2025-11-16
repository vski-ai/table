import { type TableStore } from "@/module/types.ts";
import {
  PLACEMENT_TARGET_ACESSOR,
  type PlacementTargetResolver,
} from "../store.ts";

type MenuPlamentProps = {
  store: TableStore;
};

export function useMenuPlacement(
  { store }: MenuPlamentProps,
): PlacementTargetResolver[] {
  return store.state.context_menu[PLACEMENT_TARGET_ACESSOR];
}
