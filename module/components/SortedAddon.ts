export class SortedAddon<T extends (...args: any) => any = any> {
  #map = new Map<number, Set<T>>();
  get size() {
    return this.#map.size;
  }
  use(ref: T, index: number = 0) {
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

  data(...opts: Parameters<T>): Record<string, any> {
    return Object.fromEntries(this.render(...opts).flat(1));
  }

  string(...opts: Parameters<T>): string {
    return this.render(...opts)
      .flat(1)
      .join(" ");
  }
}
