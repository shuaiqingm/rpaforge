import React, { useEffect, useMemo, useState } from 'react';
import { FiDownload, FiFile, FiCode } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CodeModalProps {
  isOpen: boolean;
  code: string | null;
  files?: Record<string, string> | null;
  fileCount?: number;
  onClose: () => void;
  onDownload: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  code,
  files = null,
  fileCount = 0,
  onClose,
  onDownload,
}) => {
  const trapRef = useFocusTrap(isOpen);
  const fileEntries = useMemo(() => Object.entries(files || {}), [files]);
  const [selectedFile, setSelectedFile] = useState<string | null>(
    fileEntries[0]?.[0] || null
  );

  useEffect(() => {
    setSelectedFile(fileEntries[0]?.[0] || null);
  }, [fileEntries]);

  if (!isOpen || !code) {
    return null;
  }

  const displayedCode = selectedFile
    ? files?.[selectedFile] || code
    : code;

  const lineCount = displayedCode.split('\n').length;
  const fileName = selectedFile || 'process.py';
  const runCommand = `robot ${fileName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={trapRef as React.RefObject<HTMLDivElement>} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <FiCode className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Export Complete</h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <FiFile className="w-3 h-3" />
                {fileName} — {lineCount} lines — Python (Robot Framework)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
              onClick={onDownload}
            >
              <FiDownload className="w-4 h-4" />
              {fileCount > 1 ? `Download ${fileCount} Files` : 'Download'}
            </button>
            <button
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            <span className="font-medium">To run standalone:</span>{' '}
            <code className="bg-green-100 dark:bg-green-800 px-1.5 py-0.5 rounded text-xs">{runCommand}</code>
          </p>
        </div>
        {fileEntries.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {fileEntries.map(([path]) => (
              <button
                key={path}
                className={`px-3 py-1 text-sm rounded whitespace-nowrap ${
                  selectedFile === path
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
                onClick={() => setSelectedFile(path)}
              >
                {path}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-900 p-4 rounded overflow-x-auto">
            {displayedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
