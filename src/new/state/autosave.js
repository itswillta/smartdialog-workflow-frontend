import { subscribeToFinalElementChanges } from 'react-flowy';
import { useStatusStore, WorkflowStatus } from '../store/status.store';

let isFirstTime = true;
let batchUpdateTimeout;
const isAutosaveDisabled = {};

export const autosaveFunctionObject = {};

export const disableAutosave = storeId => {
  isAutosaveDisabled[storeId] = true;
};

export const enableAutosave = storeId => {
  isAutosaveDisabled[storeId] = false;
};

export const activateAutosave = storeId => {
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

      if (useStatusStore.getState().status === WorkflowStatus.INVALID) return;

      autosaveFunctionObject.handleAutosaveWorkflow(elements);
    }, 300);
  });
};
