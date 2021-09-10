/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import {
  isNode,
  subscribeToFinalElementChanges,
  useReactFlowyStoreById,
} from 'react-flowy';

export const ensureCorrectState = storeId => {
  subscribeToFinalElementChanges(storeId)(elements => {
    const elementsToUpdate = elements.filter(element => {
      if (!isNode(element)) return false;

      if (element.type !== 'conditionNode') return false;

      if (element.data.conditions.length < 2) return false;

      if (element.data.conditionOperator) return false;

      return true;
    });

    if (!elementsToUpdate.length) return;

    const useReactFlowyStore = useReactFlowyStoreById(storeId);

    elementsToUpdate.forEach(elementToUpdate => {
      const updatedElement = {
        ...elementToUpdate,
        data: { ...elementToUpdate.data, conditionOperator: 'AND' },
      };

      useReactFlowyStore.getState().upsertNode(updatedElement);
    });
  });
};
