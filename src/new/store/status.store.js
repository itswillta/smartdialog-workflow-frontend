import create from 'zustand';
import { isEdge, isNode, subscribeToFinalElementChanges } from 'react-flowy';
import {
  detectInvalidStatus,
  detectWarningStatus,
} from './status.store.actions';

export const WorkflowStatus = {
  VALID: 'valid',
  INVALID: 'invalid',
  WARNING: 'warning',
  SAVING: 'saving',
};

export const useStatusStore = create(set => ({
  // ========== STATE ==========

  status: WorkflowStatus.VALID,
  problematicNodes: [],
  shouldShowInvalidNodes: false,
  shouldShowUnhandledConditions: false,

  // ========== ACTIONS ==========

  changeStatus: newStatus => {
    set(state => ({ ...state, status: newStatus }));
  },

  setProblematicNodes: problematicNodes => {
    set(state => ({ ...state, problematicNodes }));
  },

  setShouldShowInvalidNodes: shouldShowInvalidNodes => {
    set(state => ({ ...state, shouldShowInvalidNodes }));
  },

  setShouldShowUnhandledConditions: shouldShowUnhandledConditions => {
    set(state => ({ ...state, shouldShowUnhandledConditions }));
  },
}));

export const trackStatus = storeId => {
  let batchUpdateTimeout;

  subscribeToFinalElementChanges(storeId)(elements => {
    if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);

    batchUpdateTimeout = window.setTimeout(() => {
      const nodes = elements.filter(element => isNode(element));
      const edges = elements.filter(element => isEdge(element));

      const isInvalidStatusDetected = detectInvalidStatus(nodes, edges);

      if (isInvalidStatusDetected) return;

      const isWarningStatusDetected = detectWarningStatus(nodes, edges);

      if (isWarningStatusDetected) return;

      useStatusStore.getState().setProblematicNodes([]);
      useStatusStore.getState().changeStatus(WorkflowStatus.VALID);
    }, 100);
  });
};
