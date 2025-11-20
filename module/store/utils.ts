import { Signal } from "@preact/signals";

// serialize state for json iterop
export function serializeState(state: any): Record<string, unknown> {
  const snapshot: Record<string, unknown> = {};
  for (const key of Object.keys(state)) {
    const value = state[key as keyof typeof state];
    if (value instanceof Signal) {
      snapshot[key] = value.peek();
    } else if (typeof value === "object") {
      snapshot[key] = serializeState(value);
    } else if (typeof value !== "function") {
      snapshot[key] = value;
    }
  }
  return snapshot;
}

// restore state from a snapshot
export function restoreFromSnaphot(snap: any, state: any) {
  if (!snap) return;
  for (const key in state) {
    const ref = state[key];
    const value = snap[key];
    if (typeof value === "undefined") {
      continue;
    }
    if (ref instanceof Signal) {
      try {
        ref.value = value;
        continue;
      } catch {
        /* some signals are not writable */
      }
    }
    if (
      typeof ref === "object" && //
      typeof value === "object"
    ) {
      restoreFromSnaphot(value, ref);
    }
  }
}
