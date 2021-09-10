import { getIncomingEdges, getOutgoingEdges, getSourceNode, getTargetNode, Node } from 'solid-flowy/lib';

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
