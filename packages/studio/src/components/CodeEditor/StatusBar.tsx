import React from 'react';

interface StatusBarProps {
  line: number;
  column: number;
  encoding?: string;
  language?: string;
  isSaved?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  line,
  column,
  encoding = 'UTF-8',
  language = 'Python',
  isSaved = true,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-4">
        <span>
          Ln {line}, Col {column}
        </span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>{encoding}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>{language}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center gap-1 ${
            isSaved ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSaved ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />
          {isSaved ? 'Saved' : 'Modified'}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
