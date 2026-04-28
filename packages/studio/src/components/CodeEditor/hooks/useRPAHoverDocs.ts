import { useEffect, useRef } from 'react';
import type * as Monaco from 'monaco-editor';

interface ActivityInfo {
  id: string;
  name: string;
  library: string;
  description: string;
  params?: Array<{ name: string; type: string; description: string }>;
}

interface UseRPAHoverDocsOptions {
  activities: ActivityInfo[];
}

export function useRPAHoverDocs(monaco: Monaco.editor.IStandaloneCodeEditor | null, options: UseRPAHoverDocsOptions) {
  const disposableRef = useRef<Monaco.IDisposable | null>(null);

  useEffect(() => {
    if (!monaco || !options.activities.length) return;

    const { activities } = options;

    disposableRef.current = monaco.languages.registerHoverProvider('python', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const lineContent = model.getLineContent(position.lineNumber);
        const beforeWord = lineContent.substring(0, word.startColumn - 1).trimEnd();

        const dotMatch = beforeWord.match(/([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)$/);

        if (dotMatch) {
          const libraryName = dotMatch[1].toLowerCase();
          const methodName = dotMatch[2].toLowerCase();

          const activity = activities.find((act) => {
            const actLibrary = (act.library || '').toLowerCase();
            const actName = (act.name || act.id || '').toLowerCase();

            const libMatch =
              (libraryName === 'variables' && actLibrary.includes('variables')) ||
              actLibrary.includes(libraryName) ||
              libraryName.includes(actLibrary);

            const methodMatch =
              actName.includes(methodName) ||
              actName.replace(/[_\s]/g, '').includes(methodName.replace(/[_\s]/g, ''));

            return libMatch && methodMatch;
          });

          if (activity) {
            const paramsHtml = activity.params
              ?.slice(0, 5)
              .map(
                (p, i) =>
                  `<tr><td style="padding:2px 8px;"><code>${p.name || `arg${i + 1}`}</code></td><td style="padding:2px 8px;color:#6b7280;">${p.type || 'Any'}</td></tr>`
              )
              .join('');

            const paramsTable = paramsHtml
              ? `<table style="margin-top:8px;border-collapse:collapse;">${paramsHtml}</table>`
              : '';

            return {
              range: new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn
              ),
              contents: [
                {
                  value: `**${activity.library}.${activity.name}**\n\n${activity.description || 'RPAForge activity'}${paramsTable}`,
                  isTrusted: true,
                },
              ],
            };
          }
        }

        return null;
      },
    });

    return () => {
      disposableRef.current?.dispose();
      disposableRef.current = null;
    };
  }, [monaco, options.activities]);
}
