import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  FiFilter,
  FiSearch,
  FiTrash2,
  FiDownload,
  FiChevronDown,
  FiChevronRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { useConsoleStore, type LogEntry } from '../../stores/consoleStore';
import type { LogLevel } from '../../types/events';

interface ErrorSuggestion {
  causes: string[];
  fix: string;
}

const errorSuggestions: Record<string, ErrorSuggestion> = {
  'Element not found': {
    causes: [
      'Element not loaded yet (add Wait before)',
      'Wrong selector (check element ID)',
      'Element in different frame/tab',
    ],
    fix: 'Add "Wait For Element" before this activity to ensure page is loaded.',
  },
  'Timeout': {
    causes: [
      'Page load too slow',
      'Network latency',
      'Element never appeared',
    ],
    fix: 'Increase timeout value or add explicit wait conditions.',
  },
  'Connection refused': {
    causes: [
      'Application not running',
      'Wrong port or address',
    ],
    fix: 'Check that the target application is running and accessible.',
  },
  'Permission denied': {
    causes: [
      'Insufficient privileges',
      'File locked by another process',
    ],
    fix: 'Run the process with appropriate permissions or close conflicting applications.',
  },
  'File not found': {
    causes: [
      'Path does not exist',
      'Relative path resolved incorrectly',
    ],
    fix: 'Use absolute paths and verify the file exists before running.',
  },
};

function matchSuggestion(message: string): ErrorSuggestion | null {
  for (const [key, suggestion] of Object.entries(errorSuggestions)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return suggestion;
    }
  }
  return null;
}

const LogLevelBadge: React.FC<{ level: LogLevel }> = ({ level }) => {
  const colors: Record<LogLevel, string> = {
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    warn: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    debug: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    trace: 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500',
  };

  return (
    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${colors[level]}`}>
      {level.toUpperCase()}
    </span>
  );
};

const ErrorCard: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const suggestion = matchSuggestion(entry.message);
  const details = entry.details as Record<string, string> | undefined;

  return (
    <div className="mx-2 my-1 rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-sm">
      <button
        className="w-full flex items-start gap-2 px-2 py-1.5 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <span className="flex-1 break-all text-red-700 dark:text-red-300 font-mono">{entry.message}</span>
        {suggestion && (
          expanded ? <FiChevronDown className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> : <FiChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
        )}
      </button>
      {details?.activityName && (
        <div className="px-8 pb-1 text-xs text-red-600 dark:text-red-400">
          Activity: {details.activityName}
          {details.library && <span className="ml-2">Library: {details.library}</span>}
        </div>
      )}
      {expanded && suggestion && (
        <div className="px-8 pb-2 space-y-1">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Possible causes:</div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
            {suggestion.causes.map((cause) => (
              <li key={cause}>{cause}</li>
            ))}
          </ul>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
            Suggested fix: {suggestion.fix}
          </div>
        </div>
      )}
    </div>
  );
};

const LogLine: React.FC<{ entry: LogEntry; index: number }> = ({ entry, index }) => {
  const timeStr = entry.timestamp.toLocaleTimeString();

  if (entry.level === 'error') {
    return <ErrorCard entry={entry} />;
  }

  return (
    <div className="log-entry flex items-start gap-2 px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono text-sm">
      <span className="text-slate-400 text-xs w-10 text-right flex-shrink-0 select-none">
        {String(index + 1).padStart(3, ' ')}
      </span>
      <span className="text-slate-400 text-xs flex-shrink-0">{timeStr}</span>
      <LogLevelBadge level={entry.level} />
      {entry.source && (
        <span className="text-slate-500 text-xs flex-shrink-0">[{entry.source}]</span>
      )}
      <span className="flex-1 break-all">{entry.message}</span>
    </div>
  );
};

const ConsoleOutput: React.FC = () => {
  const logs = useConsoleStore((state) => state.logs);
  const filter = useConsoleStore((state) => state.filter);
  const searchQuery = useConsoleStore((state) => state.searchQuery);
  const autoScroll = useConsoleStore((state) => state.autoScroll);
  const clearLogs = useConsoleStore((state) => state.clearLogs);
  const toggleFilterLevel = useConsoleStore((state) => state.toggleFilterLevel);
  const setSearchQuery = useConsoleStore((state) => state.setSearchQuery);
  const setAutoScroll = useConsoleStore((state) => state.setAutoScroll);
  const exportLogs = useConsoleStore((state) => state.exportLogs);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    let filtered = logs.filter((log) => filter.includes(log.level));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          log.source?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [logs, filter, searchQuery]);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleExport = () => {
    const content = exportLogs();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rpaforge-console-${new Date().toISOString()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allLevels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];

  return (
    <div className="h-full flex flex-col">
      <div className="console-header flex items-center gap-2 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-1 flex-shrink-0">
          <FiFilter className="w-4 h-4 text-slate-400" />
          {allLevels.map((level) => (
            <button
              key={level}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                filter.includes(level)
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              onClick={() => toggleFilterLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full pl-8 pr-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
              autoScroll ? 'text-indigo-500' : 'text-slate-400'
            }`}
            onClick={() => setAutoScroll(!autoScroll)}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            <span className="text-xs">↓</span>
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={handleExport}
            title="Export logs"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            onClick={clearLogs}
            title="Clear logs"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="console-output flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-8 px-4">
            {logs.length === 0 ? (
              <>
                No logs available
                <div className="text-xs mt-1">Run a process to see console output</div>
              </>
            ) : (
              'No logs match the current filter'
            )}
          </div>
        ) : (
          filteredLogs.map((entry, index) => <LogLine key={entry.id} entry={entry} index={index} />)
        )}
      </div>

      <div className="console-footer flex items-center justify-between px-2 py-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <span>
          {filteredLogs.length} of {logs.length} entries
        </span>
        <span>Max: 10,000</span>
      </div>
    </div>
  );
};

export default ConsoleOutput;
