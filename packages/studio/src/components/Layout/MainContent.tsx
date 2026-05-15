import React from 'react';
import ProcessCanvas from '../Designer/ProcessCanvas';
import ConsoleOutput from '../Debugger/ConsoleOutput';
import DiagramTabs from '../Designer/DiagramTabs';
import BreadcrumbNavigation from '../Designer/BreadcrumbNavigation';
import { useDiagramStore } from '../../stores/diagramStore';
import { useDiagramWorkspace } from '../../hooks/useDiagramWorkspace';

interface MainContentProps {
  showConsole: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ showConsole }) => {
  const project = useDiagramStore((state) => state.project);
  const openDiagram = useDiagramStore((state) => state.openDiagram);
  const closeDiagram = useDiagramStore((state) => state.closeDiagram);
  useDiagramWorkspace();

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {project && (
        <>
          <DiagramTabs onSelectDiagram={openDiagram} onCloseDiagram={closeDiagram} />
          <BreadcrumbNavigation />
        </>
      )}
      <div className="flex-1 overflow-hidden">
        <ProcessCanvas />
      </div>
      {showConsole && (
        <div className="h-48 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <ConsoleOutput />
        </div>
      )}
    </main>
  );
};

export default MainContent;
