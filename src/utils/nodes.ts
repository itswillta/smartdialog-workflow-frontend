import { Edge, getIncomingEdges, getOutgoingEdges, getSourceNode, getTargetNode, Node } from 'solid-flowy/lib';

export const isNodeInInfiniteLoop = (storeId: string, formingEdge: Edge) => (
  firstNode: Node,
  node?: Node,
  passedNodes: Node[] = [],
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

  let outgoingEdges = getOutgoingEdges(storeId)(node)
    .filter(outgoingEdge => !outgoingEdge.isForming)

  if (node.id === formingEdge.source) {
    outgoingEdges = outgoingEdges.concat(formingEdge);
  }

  if (!outgoingEdges.length) {
    return false;
  }

  /* eslint-disable no-restricted-syntax */
  for (const outgoingEdge of outgoingEdges) {
    const targetNode = getTargetNode(storeId)(outgoingEdge);

    if (!targetNode || typeof targetNode.id === 'undefined') {
      return false;
    }

    if (targetNode.id === firstNode.id) {
      const passedConditionNode = passedNodes.find(
        passedNode => passedNode.type === 'conditionNode',
      );
  
      if (passedConditionNode) return false;
  
      return true;
    }

    try {
      const isInInfiniteLoop = isNodeInInfiniteLoop(storeId, formingEdge)(
        firstNode,
        targetNode,
        passedNodes,
      );

      if (isInInfiniteLoop) return true;
    } catch (error) {
      console.error(error);
      const passedConditionNode = passedNodes.find(
        passedNode => passedNode.type === 'conditionNode',
      );

      if (passedConditionNode) return false;

      return true;
    }
  }

  return false;
};

export const isNodeInLoop = (storeId: string) => (firstNode: Node, node?: Node) => {
  if (!node) {
    node = { ...firstNode };
  } else if (node.id === firstNode.id) {
    return true;
  }

  const outgoingEdges = getOutgoingEdges(storeId)(node).filter((edge) => !edge.isForming);

  if (!outgoingEdges.length) return false;

  return outgoingEdges.some((outcomingEdge) => {
    const targetNode = getTargetNode(storeId)(outcomingEdge);

    return isNodeInLoop(storeId)(firstNode, targetNode);
  });
};

export const getParentsOfNode = (storeId: string) => (node: Node) => {
  const incomingEdges = getIncomingEdges(storeId)(node);

  return incomingEdges.map((incomingEdge) => getSourceNode(storeId)(incomingEdge));
};

export const getIntentAndActionAncestorsOfNode = (storeId: string) => (node: Node, passedNodes: Node[] = []): Node[] => {
  const parentNodes = getParentsOfNode(storeId)(node);

  const parentStartNode = parentNodes.find(
    parentNode => parentNode.type === 'startNode',
  );

  if (parentStartNode) {
    return [];
  }

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
      const ancestorNodes = getIntentAndActionAncestorsOfNode(storeId)(
        conditionParentNode,
      );

      intentAndActionAncestorNodes = [
        ...intentAndActionAncestorNodes,
        ...ancestorNodes,
      ];
    });

    return intentAndActionAncestorNodes;
  }

  const intentAndActionAncestorNodes = intentAndActionParentNodes
    .map(intentOrActionParentNode =>
      getIntentAndActionAncestorsOfNode(storeId)(intentOrActionParentNode),
    )
    .flat();

  return [...intentAndActionParentNodes, ...intentAndActionAncestorNodes];
};