import { Edge, getIncomingEdges, getOutgoingEdges, Node } from 'solid-flowy/lib';
import { statusStore, WorkflowStatus } from './status.store';

export const detectInvalidStatus = (storeId: string) => (nodes: Node[], edges: Edge[]) => {
  // TODO: Workflow without a start node is also invalid

  const nodesWithNoIncomingEdges = nodes.filter(node => {
    const incomingEdges = getIncomingEdges(storeId)(node);

    return node.type !== 'startNode' && incomingEdges.length === 0;
  });

  const nodesWithNoOutgoingEdges = nodes.filter(node => {
    const outgoingEdges = getOutgoingEdges(storeId)(node);

    return (
      node.type !== 'localTerminateNode' &&
      node.type !== 'globalTerminateNode' &&
      outgoingEdges.length === 0
    );
  });

  const conditionNodesWithoutLoopEndEdges = nodes.filter(node => {
    if (node.type !== 'conditionNode' || !node.data || !node.data.loopCount)
      return false;

    const outgoingEdges = getOutgoingEdges(storeId)(node);

    const loopEndEdge = outgoingEdges.find(edge => edge.type === 'loopEndEdge');

    return !loopEndEdge;
  });

  const nodesWithEmptyData = nodes.filter(node => {
    if (!node.data) return false;

    if (node.type === 'intentNode' && !node.data.intent) return true;

    if (node.type === 'actionNode' && !node.data.action) return true;

    if (node.type === 'conditionNode') {
      let isThereAnEmptyDataField = false;

      node.data.conditions.forEach((condition: Record<string, unknown>) => {
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

    statusStore[1].setProblematicNodes(problematicNodes);
    statusStore[1].setShouldShowUnhandledConditions(false);

    statusStore[1].changeStatus(WorkflowStatus.INVALID);

    return true;
  }

  return false;
};

export const detectWarningStatus = (storeId: string) => (nodes: Node[], edges: Edge[]) => {
  const conditionNodes = nodes.filter(node => node.type === 'conditionNode');
  const nodesWithWarning = [];

  conditionNodes.forEach(conditionNode => {
    if (
      conditionNode.data &&
      conditionNode.data.shouldShowNotAvailableParamWarning
    ) {
      nodesWithWarning.push({
        id: conditionNode.id,
        status: WorkflowStatus.WARNING,
        message: 'notAvailableParamWarningMessage',
      });
    }

    const outgoingEdges = getOutgoingEdges(storeId)(conditionNode);

    let doesTrueEdgeExist = false;
    let doesFalseEdgeExist = false;

    outgoingEdges.forEach(outcomingEdge => {
      if (outcomingEdge.label === 'TRUE') doesTrueEdgeExist = true;
      else if (outcomingEdge.label === 'FALSE') doesFalseEdgeExist = true;
    });

    if (!doesTrueEdgeExist || !doesFalseEdgeExist) {
      nodesWithWarning.push({
        id: conditionNode.id,
        status: WorkflowStatus.WARNING,
        message: 'unhandledConditionWarningMessage',
      });
    }
  });

  if (nodesWithWarning.length > 0) {
    statusStore[1].setShouldShowInvalidNodes(false);
    statusStore[1].setProblematicNodes(nodesWithWarning);

    statusStore[1].changeStatus(WorkflowStatus.WARNING);

    return true;
  }

  return false;
};
