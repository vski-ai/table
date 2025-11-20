import { StorageAdapter } from "../components/LocalStorageAdapter.ts";

export class NoopStorageAdapter implements StorageAdapter {
  getItem<T>(key: string): T | null {
    return null;
  }
  setItem<T>(key: string, value: T): void {}
  removeItem(key: string): void {}
}
