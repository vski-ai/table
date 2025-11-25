import { type Store } from "@xmod/types.ts";
import {
  PLACEMENT_TARGET_ACESSOR,
  type PlacementTargetResolver,
} from "../store.ts";

type MenuPlamentProps = {
  store: Store;
  items: PlacementTargetResolver[];
};

export function addMenuPlacement({ store, items }: MenuPlamentProps) {
  const targets = store.state.context_menu[PLACEMENT_TARGET_ACESSOR];
  targets.unshift(...items);
  const unique = new Set<string>();
  for (const target of targets) {
    if (unique.has(target.name)) {
      console.error(`MENU PLACEMENT: ${target.name} is not unique.
        Ensure unique name and target selector when creating new placement target`);
    }
    unique.add(target.name);
  }
}
