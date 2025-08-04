// AsyncStorage mock for Jest tests
const AsyncStorageMock = {
  storage: new Map(),

  async getItem(key) {
    return this.storage.get(key) || null;
  },

  async setItem(key, value) {
    this.storage.set(key, value);
  },

  async removeItem(key) {
    this.storage.delete(key);
  },

  async clear() {
    this.storage.clear();
  },

  async getAllKeys() {
    return Array.from(this.storage.keys());
  },

  async multiGet(keys) {
    return keys.map((key) => [key, this.storage.get(key) || null]);
  },

  async multiSet(pairs) {
    pairs.forEach(([key, value]) => {
      this.storage.set(key, value);
    });
  },

  async multiRemove(keys) {
    keys.forEach((key) => {
      this.storage.delete(key);
    });
  },
};

export default AsyncStorageMock;
