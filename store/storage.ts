export interface StorageAdapter {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

export class LocalStorageAdapter implements StorageAdapter {
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  }
}
