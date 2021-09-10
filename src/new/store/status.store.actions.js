import { getIncomingEdges, getOutgoingEdges } from 'react-flowy';
import { useStatusStore, WorkflowStatus } from './status.store';

export const detectInvalidStatus = (nodes, edges) => {
  // TODO: Workflow without a start node is also invalid

  const nodesWithNoIncomingEdges = nodes.filter(node => {
    const incomingEdges = getIncomingEdges(edges)(node);

    return node.type !== 'startNode' && incomingEdges.length === 0;
  });

  const nodesWithNoOutgoingEdges = nodes.filter(node => {
    const outgoingEdges = getOutgoingEdges(edges)(node);

    return (
      node.type !== 'localTerminateNode' &&
      node.type !== 'globalTerminateNode' &&
      outgoingEdges.length === 0
    );
  });

  const conditionNodesWithoutLoopEndEdges = nodes.filter(node => {
    if (node.type !== 'conditionNode' || !node.data || !node.data.loopCount)
      return false;

    const outgoingEdges = getOutgoingEdges(edges)(node);

    const loopEndEdge = outgoingEdges.find(edge => edge.type === 'loopEndEdge');

    return !loopEndEdge;
  });

  const nodesWithEmptyData = nodes.filter(node => {
    if (!node.data) return false;

    if (node.type === 'intentNode' && !node.data.intent) return true;

    if (node.type === 'actionNode' && !node.data.action) return true;

    if (node.type === 'conditionNode') {
      let isThereAnEmptyDataField = false;

      node.data.conditions.forEach(condition => {
        if (condition.parameter && condition.operator && condition.value)
          return;

        isThereAnEmptyDataField = true;
      });

      return isThereAnEmptyDataField;
    }

    return false;
  });

  if (
    nodesWithNoIncomingEdges.length > 0 ||
    nodesWithNoOutgoingEdges.length > 0 ||
    conditionNodesWithoutLoopEndEdges.length > 0 ||
    nodesWithEmptyData.length > 0
  ) {
    const problematicNodes = [
      ...nodesWithNoIncomingEdges.map(({ id }) => ({
        id,
        status: WorkflowStatus.INVALID,
        message: 'noIncomingEdgeMessage',
      })),
      ...nodesWithNoOutgoingEdges.map(({ id }) => ({
        id,
        status: WorkflowStatus.INVALID,
        message: 'noOutgoingEdgeMessage',
      })),
      ...conditionNodesWithoutLoopEndEdges.map(({ id }) => ({
        id,
        status: WorkflowStatus.INVALID,
        message: 'noLoopEndEdgeMessage',
      })),
      ...nodesWithEmptyData.map(({ id }) => ({
        id,
        status: WorkflowStatus.INVALID,
        message: 'emptyDataFieldMessage',
      })),
    ];

    useStatusStore.getState().setProblematicNodes(problematicNodes);
    useStatusStore.getState().setShouldShowUnhandledConditions(false);

    useStatusStore.getState().changeStatus(WorkflowStatus.INVALID);

    return true;
  }

  return false;
};

export const detectWarningStatus = (nodes, edges) => {
  const conditionNodes = nodes.filter(node => node.type === 'conditionNode');
  const nodesWithWarning = [];

  conditionNodes.forEach(conditionNode => {
    const outcomingEdges = getOutgoingEdges(edges)(conditionNode);

    let doesTrueEdgeExist = false;
    let doesFalseEdgeExist = false;

    outcomingEdges.forEach(outcomingEdge => {
      if (outcomingEdge.label === 'TRUE') doesTrueEdgeExist = true;
      else if (outcomingEdge.label === 'FALSE') doesFalseEdgeExist = true;
    });

    if (!doesTrueEdgeExist || !doesFalseEdgeExist) {
      nodesWithWarning.push({
        id: conditionNode.id,
        status: WorkflowStatus.WARNING,
        message: 'There are unhandled conditions.',
      });
    }
  });

  if (nodesWithWarning.length > 0) {
    useStatusStore.getState().setShouldShowInvalidNodes(false);
    useStatusStore.getState().setProblematicNodes(nodesWithWarning);

    useStatusStore.getState().changeStatus(WorkflowStatus.WARNING);

    return true;
  }

  return false;
};
