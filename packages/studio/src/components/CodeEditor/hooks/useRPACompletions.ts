import { useEffect, useState, useCallback, useRef } from 'react';
import type * as Monaco from 'monaco-editor';
import type { Activity } from '../../../types/engine';

interface RPACompletionCache {
  activities: Activity[];
  timestamp: number;
  ttl: number;
}

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

export function useRPACompletions() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<RPACompletionCache | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!window.rpaforge?.engine) {
      return;
    }

    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < cacheRef.current.ttl) {
      setActivities(cacheRef.current.activities);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.rpaforge.engine.getActivities();
      if (result && 'activities' in result) {
        setActivities(result.activities);
        cacheRef.current = {
          activities: result.activities,
          timestamp: Date.now(),
          ttl: DEFAULT_CACHE_TTL,
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const registerCompletions = useCallback(
    (monaco: typeof Monaco) => {
      const disposable = monaco.languages.registerCompletionItemProvider('python', {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          const activitySuggestions: Monaco.languages.CompletionItem[] = activities.map(
            (activity) => ({
              label: activity.name,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: activity.params.length > 0
                ? `${activity.name}(${activity.params.map((a, i) => `\${${i + 1}:${a.name}}`).join(', ')})`
                : `${activity.name}()`,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: {
                value: `**${activity.name}** (${activity.library})\n\n${activity.description}\n\n${
                  activity.params.length > 0
                    ? `**Parameters:**\n${activity.params
                        .map((a) => `- \`${a.name}\` (${a.type})${a.required ? ' *required*' : ''}`)
                        .join('\n')}`
                    : ''
                }`,
                isTrusted: true,
              },
              detail: activity.library,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            })
          );

          const librarySuggestions: Monaco.languages.CompletionItem[] = [
            'DesktopUI',
            'WebUI',
            'Excel',
            'OCR',
            'Database',
            'Credentials',
          ].map((lib) => ({
            label: lib,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: lib,
            documentation: {
              value: `**${lib}** - RPAForge ${lib} library`,
              isTrusted: true,
            },
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          }));

          const dotMatch = textUntilPosition.match(/(\w+)\.(\w*)$/);
          if (dotMatch) {
            const prefix = dotMatch[2];
            const filteredActivities = activities.filter((a) =>
              a.name.toLowerCase().startsWith(prefix.toLowerCase())
            );

            return {
              suggestions: filteredActivities.map((activity) => ({
                label: activity.name,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: activity.params.length > 0
                  ? `${activity.name}(${activity.params.map((_, i) => `\${${i + 1}:${_.name}}`).join(', ')})`
                  : `${activity.name}()`,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: {
                  value: `**${activity.name}** (${activity.library})\n\n${activity.description}`,
                  isTrusted: true,
                },
                detail: activity.library,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column - prefix.length,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
              })),
            };
          }

          const importMatch = textUntilPosition.match(/from\s+(\w*)$/);
          if (importMatch) {
            const prefix = importMatch[1];
            return {
              suggestions: librarySuggestions.filter((s) =>
                String(s.label).toLowerCase().startsWith(prefix.toLowerCase())
              ),
            };
          }

          return {
            suggestions: [...activitySuggestions, ...librarySuggestions],
          };
        },
      });

      const hoverDisposable = monaco.languages.registerHoverProvider('python', {
        provideHover: (_model, position) => {
          const word = _model.getWordAtPosition(position);
          if (!word) return null;

          const activity = activities.find(
            (a) => a.name === word.word
          );

          if (!activity) return null;

          return {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: word.endColumn,
            },
            contents: [
              {
                value: `**${activity.name}** \`${activity.library}\``,
                isTrusted: true,
              },
              {
                value: activity.description,
                isTrusted: true,
              },
              ...(activity.params.length > 0
                ? [
                    {
                      value: `**Parameters:**\n${activity.params
                        .map((a) => `- \`${a.name}\` (${a.type})${a.required ? ' *required*' : ''}`)
                        .join('\n')}`,
                      isTrusted: true,
                    },
                  ]
                : []),
            ],
          };
        },
      });

      return () => {
        disposable.dispose();
        hoverDisposable.dispose();
      };
    },
    [activities]
  );

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
    registerCompletions,
  };
}
