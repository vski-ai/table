export class SortedAddon<T extends (...args: any) => any = any> {
  #map = new Map<number, Set<T>>();
  use(index: number, ref: T) {
    if (!(this.#map.get(index) instanceof Set)) {
      this.#map.set(index, new Set());
    }
    this.#map.get(index)?.add(ref);
  }

  getSorted(): T[] {
    const sortedKeys = [...this.#map.keys()].sort((a, b) => a - b);
    return sortedKeys.flatMap((key) => [...(this.#map.get(key) ?? [])]);
  }

  render(...opts: Parameters<T>): ReturnType<T>[] {
    return this.getSorted().map((cb) => cb(...opts));
  }
}
