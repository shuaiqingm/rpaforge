import React from 'react';
import { PropertyPanel } from '../Designer/PropertyPanel';
import VariablesPanel from '../Designer/VariablesPanel';
import CallStackPanel from '../Debugger/CallStackPanel';
import ExecutionHistoryPanel from '../Debugger/ExecutionHistoryPanel';

interface PropertiesSidebarProps {
  isDebugging: boolean;
}

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = React.memo(({ isDebugging }) => {
  return (
    <aside className="w-72 border-l border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        <PropertyPanel />
      </div>
      {isDebugging ? (
        <div className="flex-1 flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-700">
          <div className="flex-1 overflow-hidden">
            <ExecutionHistoryPanel />
          </div>
          <div className="flex-1 overflow-hidden border-t border-slate-200 dark:border-slate-700">
            <CallStackPanel />
          </div>
        </div>
      ) : (
        <VariablesPanel defaultExpanded={true} />
      )}
    </aside>
  );
});

PropertiesSidebar.displayName = 'PropertiesSidebar';

export default PropertiesSidebar;
