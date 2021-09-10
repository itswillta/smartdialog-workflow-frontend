import { FlowElement, subscribeToFinalElementChanges } from 'solid-flowy/lib';
import { statusStore, WorkflowStatus } from '../store/status.store';

let isFirstTime = true;
let batchUpdateTimeout: number;
const isAutosaveDisabled = {};

interface AutosaveFunctionObject {
  handleAutosaveWorkflow?: (elements: FlowElement[]) => Promise<void>;
}

export const autosaveFunctionObject: AutosaveFunctionObject = {};

export const disableAutosave = (storeId: string) => {
  isAutosaveDisabled[storeId] = true;
};

export const enableAutosave = (storeId: string) => {
  isAutosaveDisabled[storeId] = false;
};

export const activateAutosave = (storeId: string) => {
  subscribeToFinalElementChanges(storeId)(elements => {
    if (isFirstTime) {
      isFirstTime = false;

      return;
    }

    if (isAutosaveDisabled[storeId]) return;

    if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

    batchUpdateTimeout = setTimeout(() => {
      if (typeof autosaveFunctionObject.handleAutosaveWorkflow !== 'function')
        return;

      if (statusStore[0].status === WorkflowStatus.INVALID) return;

      autosaveFunctionObject.handleAutosaveWorkflow(elements);
    }, 300);
  });
};
