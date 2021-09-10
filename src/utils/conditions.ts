import { Node } from 'solid-flowy/lib';
import { getParentsOfNode } from './nodes';

export const getAvailableParameters = ({
  storeId,
  node,
  slots,
  intents,
  actions,
}: {
  storeId: string;
  node: Node;
  slots: any[];
  intents: any[];
  actions: any[];
}) => {
  const parentNodes = getParentsOfNode(storeId)(node);

  const unfilteredAvailableParams = parentNodes
    .map((parentNode) => {
      if (parentNode.type === 'intentNode') {
        const foundIntent = intents.find((intent) => intent.id === parentNode.data.intent);

        if (!foundIntent) return;

        const availableParameterNames = foundIntent.parameters.map(({ name }) => name);

        const availableSlots = slots.filter((slot) => availableParameterNames.includes(slot.name));

        return availableSlots;
      }

      if (parentNode.type === 'actionNode') {
        const foundAction = actions.find((action) => action.id === parentNode.data.action);

        if (!foundAction) return;

        const availableParameterNames = foundAction.parameters.map(({ name }) => name);

        const availableSlots = slots.filter((slot) => availableParameterNames.includes(slot.name));

        return availableSlots;
      }

      return null;
    })
    .filter(Boolean)
    .flat();

  const existingParamIds = [];

  return unfilteredAvailableParams.filter((unfilteredParam) => {
    if (existingParamIds.includes(unfilteredParam.id)) return false;

    existingParamIds.push(unfilteredParam.id);

    return true;
  });
};
