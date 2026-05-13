import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  withTranslation: (ns: string) => (Component: any) => {
    const WrappedComponent = (props: any) => {
      const t = (key: string) => {
        const translations: Record<string, string> = {
          'common.run': 'Run',
          'common.export': 'Export',
          'common.close': 'Close',
          'common.cancel': 'Cancel',
          'common.save': 'Save',
          'common.yes': 'Yes',
          'common.no': 'No',
          'common.ok': 'OK',
          'common.cancel': 'Cancel',
          'common.delete': 'Delete',
          'common.add': 'Add',
          'common.edit': 'Edit',
          'common.duplicate': 'Duplicate',
          'common.copy': 'Copy',
          'common.paste': 'Paste',
          'common.cut': 'Cut',
          'common.select': 'Select',
          'common.select_all': 'Select All',
          'common.deselect': 'Deselect',
          'common.clear': 'Clear',
          'common.refresh': 'Refresh',
          'common.settings': 'Settings',
          'common.help': 'Help',
          'common.about': 'About',
          'propertyEditors.switch.cases': 'Cases',
          'propertyEditors.switch.addCase': 'Add case',
          'propertyEditors.switch.label': 'Label',
          'propertyEditors.switch.value': 'Value',
          'propertyEditors.switch.caseN': 'Case {{n}}',
          'propertyEditors.switch.noCases': 'No cases',
          'propertyEditors.switch.expression': 'Expression',
          'propertyEditors.subDiagram.openDiagram': 'Open diagram',
          'propertyEditors.subDiagramCallBlock.tooltip': 'Open diagram',
          'subDiagramCallBlock.inputs': 'Inputs',
          'subDiagramCallBlock.outputs': 'Outputs',
          'propertyEditors.tryCatch.handlers': 'Exception handlers',
          'propertyEditors.tryCatch.enableFinally': 'Enable FINALLY path',
          'errors.somethingWentWrong': 'Something went wrong',
          'errors.somethingWentWrongDesc': 'Please try again later.',
          'errors.tryAgain': 'Try Again',
          'errors.reloadPage': 'Reload Page',
        };
        return translations[key] || key;
      };
      return <Component {...props} t={t} />;
    };
    WrappedComponent.displayName = `withTranslation(${ns})`;
    return WrappedComponent;
  },
  useTranslation: (ns: string) => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.run': 'Run',
        'common.export': 'Export',
        'common.close': 'Close',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.ok': 'OK',
        'common.delete': 'Delete',
        'common.add': 'Add',
        'common.edit': 'Edit',
        'common.duplicate': 'Duplicate',
        'common.copy': 'Copy',
        'common.paste': 'Paste',
        'common.cut': 'Cut',
        'common.select': 'Select',
        'common.select_all': 'Select All',
        'common.deselect': 'Deselect',
        'common.clear': 'Clear',
        'common.refresh': 'Refresh',
        'common.settings': 'Settings',
        'common.help': 'Help',
        'common.about': 'About',
        'propertyEditors.switch.cases': 'Cases',
        'propertyEditors.switch.addCase': 'Add case',
        'propertyEditors.switch.label': 'Label',
        'propertyEditors.switch.value': 'Value',
        'propertyEditors.switch.caseN': 'Case {{n}}',
        'propertyEditors.switch.noCases': 'No cases',
        'propertyEditors.switch.expression': 'Expression',
        'propertyEditors.subDiagram.openDiagram': 'Open diagram',
        'propertyEditors.subDiagramCallBlock.tooltip': 'Open diagram',
        'subDiagramCallBlock.inputs': 'Inputs',
        'subDiagramCallBlock.outputs': 'Outputs',
        'propertyEditors.tryCatch.handlers': 'Exception handlers',
        'propertyEditors.tryCatch.enableFinally': 'Enable FINALLY path',
        'errors.somethingWentWrong': 'Something went wrong',
        'errors.somethingWentWrongDesc': 'Please try again later.',
        'errors.tryAgain': 'Try Again',
        'errors.reloadPage': 'Reload Page',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

if (typeof window !== 'undefined') {
  (window as unknown as { clearStorage: () => void }).clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
  };
  if (!window.requestIdleCallback) {
    const originalSetTimeout = window.setTimeout;
    window.requestIdleCallback = ((cb: IdleRequestCallback) => {
      return originalSetTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0) as unknown as number;
    }) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = ((handle: number) => {
      clearTimeout(handle as unknown as ReturnType<typeof setTimeout>);
    }) as typeof window.cancelIdleCallback;
  }
  if (typeof window.indexedDB === 'undefined') {
    const mockStore = () => ({
      put: () => ({ onsuccess: null, onerror: null }),
      get: () => ({ onsuccess: null, onerror: null, result: undefined }),
      delete: () => ({ onsuccess: null, onerror: null }),
      clear: () => ({ onsuccess: null, onerror: null }),
      getAll: () => ({ onsuccess: null, onerror: null, result: [] }),
      index: () => ({
        getAll: () => ({ onsuccess: null, onerror: null, result: [] }),
        openCursor: () => ({ onsuccess: null, onerror: null }),
      }),
      createIndex: () => {},
    });
    const mockDB = {
      objectStoreNames: { contains: () => false },
      createObjectStore: () => mockStore(),
      transaction: () => ({
        objectStore: mockStore,
        oncomplete: null,
        onerror: null,
        onabort: null,
      }),
      oncomplete: null,
      onerror: null,
    };
    window.indexedDB = {
      open: (_name: string, _version: number) => {
        const req = {
          onsuccess: null as (() => void) | null,
          onerror: null as (() => void) | null,
          result: mockDB,
        };
        setTimeout(() => {
          if (req.onsuccess) {
            req.onsuccess();
          }
        }, 0);
        return req;
      },
      deleteDatabase: () => ({
        onsuccess: null as (() => void) | null,
        onerror: null as (() => void) | null,
      }),
    } as unknown as IDBFactory;
  }
}

