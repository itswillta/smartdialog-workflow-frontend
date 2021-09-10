import {
  isNode,
  Node,
  subscribeToFinalElementChanges,
  useSolidFlowyStoreById,
} from 'solid-flowy/lib';

export const ensureCorrectState = (storeId: string) => {
  subscribeToFinalElementChanges(storeId)(elements => {
    const elementsToUpdate = elements.filter(element => {
      if (!isNode(element)) return false;

      if (element.type !== 'conditionNode') return false;

      if (element.data.conditions.length < 2) return false;

      if (element.data.conditionOperator) return false;

      return true;
    });

    if (!elementsToUpdate.length) return;

    const [state, { upsertNode }] = useSolidFlowyStoreById(storeId);

    elementsToUpdate.forEach(elementToUpdate => {
      const updatedElement = {
        ...elementToUpdate,
        data: { ...elementToUpdate.data, conditionOperator: 'AND' },
      } as Node;

      upsertNode(updatedElement);
    });
  });
};
