if (typeof window !== 'undefined') {
  (window as unknown as { clearStorage: () => void }).clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
  };
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0);
    window.cancelIdleCallback = (id) => clearTimeout(id);
  }
}

