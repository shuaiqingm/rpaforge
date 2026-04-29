if (typeof window !== 'undefined') {
  (window as unknown as { clearStorage: () => void }).clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
  };
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = ((cb: () => void) => setTimeout(cb, 0)) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = ((id: ReturnType<typeof setTimeout>) => clearTimeout(id)) as typeof window.cancelIdleCallback;
  }
  if (typeof window.indexedDB === 'undefined') {
    const mockDB: Record<string, unknown> = {};
    window.indexedDB = {
      open: () => ({ onsuccess: null, onerror: null, result: mockDB }),
      deleteDatabase: () => ({ onsuccess: null, onerror: null }),
    } as unknown as IDBFactory;
  }
}

