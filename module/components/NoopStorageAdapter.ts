import { StorageAdapter } from "../components/LocalStorageAdapter.ts";

export class NoopStorageAdapter implements StorageAdapter {
  getItem<T>(_: string): T | null {
    return null;
  }
  setItem<T>(_: string, __: T): void {}
  removeItem(_: string): void {}
}
