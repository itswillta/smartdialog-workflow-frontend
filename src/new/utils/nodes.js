import {
  getIncomingEdges,
  getOutgoingEdges,
  getSourceNode,
  getTargetNode,
} from 'react-flowy';

export const isNodeInInfiniteLoop = (nodes, edges) => (
  firstNode,
  node,
  passedNodes = [],
) => {
  if (!node) {
    /* eslint-disable no-param-reassign */
    node = { ...firstNode };
  } else if (node.id === firstNode.id) {
    const passedConditionNode = passedNodes.find(
      passedNode => passedNode.type === 'conditionNode',
    );

    if (passedConditionNode) return false;

    return true;
  }

  passedNodes = [...passedNodes, node];

  const outgoingEdges = getOutgoingEdges(edges)(node);

  if (!outgoingEdges.length) {
    return false;
  }

  /* eslint-disable no-restricted-syntax */
  for (const outgoingEdge of outgoingEdges) {
    const targetNode = getTargetNode(nodes)(outgoingEdge);

    if (!targetNode) {
      return false;
    }

    if (targetNode.id === firstNode.id) {
      return true;
    }

    try {
      const isInInfiniteLoop = isNodeInInfiniteLoop(nodes, edges)(
        firstNode,
        targetNode,
        passedNodes,
      );

      if (isInInfiniteLoop) return true;
    } catch (error) {
      const passedConditionNode = passedNodes.find(
        passedNode => passedNode.type === 'conditionNode',
      );

      if (passedConditionNode) return false;

      return true;
    }
  }

  return false;
};

export const isNodeInLoop = (nodes, edges) => (firstNode, node) => {
  if (!node) {
    /* eslint-disable no-param-reassign */
    node = { ...firstNode };
  } else if (node.id === firstNode.id) {
    return true;
  }

  const outgoingEdges = getOutgoingEdges(edges)(node).filter(
    edge => !edge.isForming,
  );

  if (!outgoingEdges.length) return false;

  return outgoingEdges.some(outgoingEdge => {
    const targetNode = getTargetNode(nodes)(outgoingEdge);

    return isNodeInLoop(nodes, edges)(firstNode, targetNode);
  });
};

export const getParentsOfNode = (nodes, edges) => node => {
  const incomingEdges = getIncomingEdges(edges)(node);

  return incomingEdges
    .filter(incomingEdge => !incomingEdge.isForming)
    .map(incomingEdge => getSourceNode(nodes)(incomingEdge));
};

export const getIntentAndActionAncestorsOfNode = (nodes, edges) => node => {
  const parentNodes = getParentsOfNode(nodes, edges)(node);
  const intentAndActionParentNodes = parentNodes.filter(
    parentNode =>
      parentNode.type === 'intentNode' || parentNode.type === 'actionNode',
  );
  const conditionParentNodes = parentNodes.filter(
    parentNode => parentNode.type === 'conditionNode',
  );

  if (conditionParentNodes.length > 0) {
    let intentAndActionAncestorNodes = [...intentAndActionParentNodes];
    conditionParentNodes.forEach(conditionParentNode => {
      const ancestorNodes = getIntentAndActionAncestorsOfNode(nodes, edges)(
        conditionParentNode,
      );

      intentAndActionAncestorNodes = [
        ...intentAndActionAncestorNodes,
        ...ancestorNodes,
      ];
    });

    return intentAndActionAncestorNodes;
  }

  return intentAndActionParentNodes;
};
