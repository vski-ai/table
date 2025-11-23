import { type Store } from "@xmod/types.ts";
import {
  PLACEMENT_TARGET_ACESSOR,
  type PlacementTargetResolver,
} from "../store.ts";

type MenuPlamentProps = {
  store: Store;
};

export function useMenuPlacement({
  store,
}: MenuPlamentProps): PlacementTargetResolver[] {
  return store.state.context_menu[PLACEMENT_TARGET_ACESSOR];
}
