export default {
  getItem<T>(key: string, defaultValue: T): T {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return defaultValue;
  },

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}