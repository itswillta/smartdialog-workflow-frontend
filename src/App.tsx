import {
  Component,
  Show,
  createContext,
  createSignal,
  useContext,
  Accessor,
  onMount,
  createEffect,
  onCleanup,
} from 'solid-js';
import { I18nProvider } from '@amoutonbrady/solid-i18n';
import { Edge, FlowElement, initializeSolidFlowyStore, initializeUndoRedoStore, Node } from 'solid-flowy/lib';

import './App.scss';
import Workflow from './components/Workflow';
import Sidebar from './components/sidebar/Sidebar';
import en from './locales/en.json';
import vi from './locales/vi.json';
import Toolbar from './components/toolbar/Toolbar';
import { Portal } from 'solid-js/web';
import { autosaveFunctionObject } from './state/autosave';

export const bridgingFunctions: Record<string, Function> = {};

const [bridgingSignals, setBridgingSignals] = createSignal<Record<string, any>>({});

export { bridgingSignals, setBridgingSignals };

interface WorkflowContextData {
  intents: Accessor<any[]>;
  actions: Accessor<any[]>;
  slots: Accessor<any[]>;
  workflows: Accessor<any[]>;
  autoSaveStatus: Accessor<string>;
  accessToken: Accessor<string>;
  agentId: Accessor<string>;
  workflowId: Accessor<string>;
  workflowBasicData: Accessor<any>;
  workflow: Accessor<(Node | Edge)[]>;
}

const WorkflowContext = createContext<WorkflowContextData>();

const i18nDictionary = { en, vi };

interface WorkflowAppProps {
  exitApp: () => void;
}

const WorkflowApp: Component<WorkflowAppProps> = (props) => {
  const storeId = initializeSolidFlowyStore();
  initializeUndoRedoStore(storeId);
  const [intents, setIntents] = createSignal([]);
  const [actions, setActions] = createSignal([]);
  const [slots, setSlots] = createSignal([]);
  const [workflows, setWorkflows] = createSignal([]);
  const [workflowId, setWorkflowId] = createSignal('');
  const [agentId, setAgentId] = createSignal('');
  const [accessToken, setAccessToken] = createSignal('');
  const [workflowBasicData, setWorkflowBasicData] = createSignal({});
  const [autoSaveStatus, setAutoSaveStatus] = createSignal('');
  const [workflow, setWorkflow] = createSignal([]);

  onMount(() => {
    autosaveFunctionObject.handleAutosaveWorkflow = bridgingFunctions.handleAutosaveWorkflow as ((elements: FlowElement[]) => Promise<void>);
  });

  createEffect(() => {
    if (!Array.isArray(bridgingSignals().intents)) return;

    setIntents(bridgingSignals().intents);
  });

  createEffect(() => {
    if (!Array.isArray(bridgingSignals().actions)) return;

    setActions(bridgingSignals().actions);
  });

  createEffect(() => {
    if (!Array.isArray(bridgingSignals().slots)) return;

    setSlots(bridgingSignals().slots);
  });

  createEffect(() => {
    if (!Array.isArray(bridgingSignals().workflows)) return;

    setWorkflows(bridgingSignals().workflows);
  });

  createEffect(() => {
    if (typeof bridgingSignals().autoSaveStatus !== 'string') return;

    setAutoSaveStatus(bridgingSignals().autoSaveStatus);
  });

  createEffect(() => {
    if (typeof bridgingSignals().agentId === 'string') setAgentId(bridgingSignals().agentId);
  });

  createEffect(() => {
    if (typeof bridgingSignals().workflowId === 'string') setWorkflowId(bridgingSignals().workflowId);
  });

  createEffect(() => {
    if (typeof bridgingSignals().accessToken === 'string') setAccessToken(bridgingSignals().accessToken);
  });

  createEffect(() => {
    if (typeof bridgingSignals().workflowBasicData === 'object')
      setWorkflowBasicData(bridgingSignals().workflowBasicData);
  });

  createEffect(() => {
    if (Array.isArray(bridgingSignals().workflow)) setWorkflow(bridgingSignals().workflow);
  });

  return (
    <div class="workflow-app">
      <WorkflowContext.Provider
        value={{
          intents,
          actions,
          slots,
          workflows,
          autoSaveStatus,
          accessToken,
          agentId,
          workflowId,
          workflowBasicData,
          workflow,
        }}
      >
        <I18nProvider dict={i18nDictionary} locale="vi">
          <Show when={storeId} fallback={null}>
            <Sidebar storeId={storeId} exitApp={props.exitApp} />
            <Workflow storeId={storeId} />
            <Toolbar storeId={storeId} />
          </Show>
        </I18nProvider>
      </WorkflowContext.Provider>
    </div>
  );
};

const App: Component = () => {
  const [shouldShowApp, setShouldShowApp] = createSignal(true);

  createEffect(() => {
    if (typeof bridgingSignals().shouldShowApp === 'boolean') {
      setShouldShowApp(bridgingSignals().shouldShowApp);
    }
  });

  const exitApp = () => {
    if (typeof bridgingFunctions.handleClose === 'function') {
      setShouldShowApp(false);

      setTimeout(() => bridgingFunctions.handleClose());
    }
  };

  return (
    <Show when={shouldShowApp()}>
      <WorkflowApp exitApp={exitApp} />
    </Show>
  );
};

export const useWorkflowContext = () => {
  return useContext(WorkflowContext);
};

export default App;
