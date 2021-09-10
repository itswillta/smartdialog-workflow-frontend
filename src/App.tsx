import { Component, Show, createContext, createSignal, useContext, Accessor, onMount } from 'solid-js';
import { I18nProvider } from '@amoutonbrady/solid-i18n';
import { initializeSolidFlowyStore, initializeUndoRedoStore } from 'solid-flowy/lib';

import './App.scss';
import Workflow from './components/Workflow';
import defaultIntents from './data/intents.json';
import defaultActions from './data/actions.json';
import defaultSlots from './data/entities.json';
import defaultWorkflows from './data/workflows.json';
import Sidebar from './components/sidebar/Sidebar';
import en from './locales/en.json';
import vi from './locales/vi.json';
import Toolbar from './components/toolbar/Toolbar';

interface WorkflowContextData {
  intents: Accessor<typeof defaultIntents>;
  actions: Accessor<typeof defaultActions>;
  slots: Accessor<typeof defaultSlots>;
  workflows: Accessor<typeof defaultWorkflows>;
  autoSaveStatus: Accessor<string>;
}

const WorkflowContext = createContext<WorkflowContextData>();

const i18nDictionary = { en, vi };

const App: Component = () => {
  const storeId = initializeSolidFlowyStore();
  initializeUndoRedoStore(storeId);
  const [intents, setIntents] = createSignal(defaultIntents);
  const [actions, setActions] = createSignal(defaultActions);
  const [slots, setSlots] = createSignal(defaultSlots);
  const [workflows, setWorkflows] = createSignal(defaultWorkflows);
  const [autoSaveStatus, setAutoSaveStatus] = createSignal('');


  return (
    <div class="workflow-app">
      <WorkflowContext.Provider value={{ intents, actions, slots, workflows, autoSaveStatus }}>
        <I18nProvider dict={i18nDictionary} locale="vi">
          <Show when={storeId} fallback={null}>
            <Sidebar storeId={storeId} exitApp={() => {}} />
            <Workflow storeId={storeId} />
            <Toolbar storeId={storeId} />
          </Show>
        </I18nProvider>
      </WorkflowContext.Provider>
    </div>
  );
};

export const useWorkflowContext = () => {
  return useContext(WorkflowContext);
};

export default App;
