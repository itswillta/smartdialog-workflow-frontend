import React, { useEffect, useState } from 'react';
import { initializeReactFlowyStore } from 'react-flowy';

import './WorkflowApp.css';
import Sidebar from './components/sidebar/Sidebar';
import Workflow from './components/Workflow';
import Toolbar from './components/toolbar/Toolbar';
import { autosaveFunctionObject } from './state/autosave';

function WorkflowApp({
  handleClose,
  handleUpdateWorkflow,
  handleAutosaveWorkflow,
  workflowId,
  workflow,
  workflowBasicData,
  fetchWorkflow,
  agentId,
}) {
  const [storeId, setStoreId] = useState();

  useEffect(() => {
    const id = initializeReactFlowyStore(workflowId);

    setStoreId(id);
  }, []);

  useEffect(() => {
    const handleWheel = event => {
      if (event.ctrlKey) event.preventDefault();
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    const handleKeyDown = event => {
      if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('wheel', handleWheel, { passive: false });
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(
    () => {
      autosaveFunctionObject.handleAutosaveWorkflow = handleAutosaveWorkflow;
    },
    [handleAutosaveWorkflow],
  );

  return (
    <div className="workflow-app">
      {storeId && (
        <>
          <Sidebar handleClose={handleClose} storeId={storeId} />
          <Toolbar
            handleClose={handleClose}
            handleUpdateWorkflow={handleUpdateWorkflow}
            workflowId={workflowId}
            workflowBasicData={workflowBasicData}
            fetchWorkflow={fetchWorkflow}
            agentId={agentId}
            storeId={storeId}
          />
          <Workflow initialElements={workflow} storeId={storeId} />
        </>
      )}
    </div>
  );
}

export default WorkflowApp;
