/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */

import { getIntentAndActionAncestorsOfNode } from './nodes';

export const getAvailableParameters = ({
  nodes,
  edges,
  node,
  slots,
  intents,
  actions,
}) => {
  const intentAndActionAncestors = getIntentAndActionAncestorsOfNode(
    nodes,
    edges,
  )(node);

  const unfilteredAvailableParams = intentAndActionAncestors
    .map(parentNode => {
      if (parentNode.type === 'intentNode') {
        const foundIntent = intents.find(
          intent => intent.name === parentNode.data.intent,
        );

        if (!foundIntent) return;

        const availableParameterNames = foundIntent.parameters.map(
          ({ name }) => name,
        );

        const availableSlots = slots.filter(slot =>
          availableParameterNames.includes(slot.name),
        );

        return availableSlots;
      }

      if (parentNode.type === 'actionNode') {
        const foundAction = actions.find(
          action => action.name === parentNode.data.action,
        );

        if (!foundAction) return;

        const availableParameterNames = foundAction.parameters.map(
          ({ name }) => name,
        );

        const availableSlots = slots.filter(slot =>
          availableParameterNames.includes(slot.name),
        );

        return availableSlots;
      }

      return null;
    })
    .filter(Boolean)
    .flat();

  const existingParamIds = [];

  return unfilteredAvailableParams.filter(unfilteredParam => {
    if (existingParamIds.includes(unfilteredParam.id)) return false;

    existingParamIds.push(unfilteredParam.id);

    return true;
  });
};
