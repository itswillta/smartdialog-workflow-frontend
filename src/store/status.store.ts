import { createStore, Store } from 'solid-js/store';
import { Edge, isEdge, isNode, Node, subscribeToFinalElementChanges } from 'solid-flowy/lib';
import { detectInvalidStatus, detectWarningStatus } from './status.store.actions';

export enum WorkflowStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  WARNING = 'warning',
  SAVING = 'saving',
}

interface ProblematicNode {
  id: string;
  status: WorkflowStatus;
  message: string;
}

interface StatusStoreState {
  status: WorkflowStatus;
  problematicNodes: ProblematicNode[];
  shouldShowInvalidNodes: boolean;
  shouldShowUnhandledConditions: boolean;
}

interface StatusStoreActions {
  changeStatus: (newStatus: WorkflowStatus) => void;
  setProblematicNodes: (problematicNodes: ProblematicNode[]) => void;
  setShouldShowInvalidNodes: (shouldShowInvalidNodes: boolean) => void;
  setShouldShowUnhandledConditions: (shouldShowUnhandledConditions: boolean) => void;
}

export type SolidFlowyStore = [Store<StatusStoreState>, StatusStoreActions];

const initialState: StatusStoreState = {
  status: WorkflowStatus.VALID,
  problematicNodes: [],
  shouldShowInvalidNodes: false,
  shouldShowUnhandledConditions: false,
};

const [state, setState] = createStore(initialState);

export const statusStore: SolidFlowyStore = [
  state,
  {
    changeStatus: (newStatus) => {
      setState('status', newStatus);
    },

    setProblematicNodes: (problematicNodes) => {
      setState('problematicNodes', problematicNodes);
    },

    setShouldShowInvalidNodes: (shouldShowInvalidNodes) => {
      setState('shouldShowInvalidNodes', shouldShowInvalidNodes);
    },

    setShouldShowUnhandledConditions: (shouldShowUnhandledConditions) => {
      setState('shouldShowUnhandledConditions', shouldShowUnhandledConditions);
    },
  },
];

export const useStatusStore = () => {
  return statusStore;
};

export const trackStatus = (storeId: string) => {
  let batchUpdateTimeout: number;

  subscribeToFinalElementChanges(storeId)((elements) => {
    if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

    batchUpdateTimeout = window.setTimeout(() => {
      const nodes = elements.filter((element) => isNode(element)) as Node[];
      const edges = elements.filter((element) => isEdge(element)) as Edge[];

      const isInvalidStatusDetected = detectInvalidStatus(storeId)(nodes, edges);

      if (isInvalidStatusDetected) return;

      const isWarningStatusDetected = detectWarningStatus(storeId)(nodes, edges);

      if (isWarningStatusDetected) return;

      statusStore[1].setProblematicNodes([]);
      statusStore[1].changeStatus(WorkflowStatus.VALID);
    }, 100);
  });
};
