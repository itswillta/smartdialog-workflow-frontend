import { useEffect, useRef } from 'react';
import {
  edgesSelector,
  connectShapes,
  getIncomingEdges,
  getOutgoingEdges,
  getRectangleFromNode,
  getSourceNode,
  getTargetNode,
  useReactFlowyStoreById,
  nodesSelector,
} from 'react-flowy';

const useEnsureEdgePositions = (node, storeId) => {
  const previousNodeHeight = useRef(node.height);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
  const edges = useReactFlowyStore(edgesSelector);
  const nodes = useReactFlowyStore(nodesSelector);

  useEffect(
    () => {
      if (!previousNodeHeight.current) {
        previousNodeHeight.current = node.height;

        return;
      }

      if (node.height < previousNodeHeight.current) {
        getOutgoingEdges(edges)(node).forEach(outcomingEdge => {
          if (outcomingEdge.waypoints[0].y <= node.position.y + node.height)
            return;

          const targetNode = getTargetNode(nodes)(outcomingEdge);
          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(node), ...node.shapeData },
            { ...getRectangleFromNode(targetNode), ...targetNode.shapeData },
            node.shapeType,
            targetNode.shapeType,
          );

          upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
        });

        getIncomingEdges(edges)(node).forEach(incomingEdge => {
          if (
            incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y <=
            node.position.y + node.height
          )
            return;

          const sourceNode = getSourceNode(nodes)(incomingEdge);
          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData },
            { ...getRectangleFromNode(node), ...node.shapeData },
            sourceNode.shapeType,
            node.shapeType,
          );

          upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
        });
      } else {
        getOutgoingEdges(edges)(node).forEach(outcomingEdge => {
          if (
            outcomingEdge.waypoints[0].y <
            node.position.y + previousNodeHeight.current
          )
            return;
          const targetNode = getTargetNode(nodes)(outcomingEdge);
          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(node), ...node.shapeData },
            { ...getRectangleFromNode(targetNode), ...targetNode.shapeData },
            node.shapeType,
            targetNode.shapeType,
          );

          upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
        });

        getIncomingEdges(edges)(node).forEach(incomingEdge => {
          if (
            incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y <
            node.position.y + previousNodeHeight.current
          )
            return;

          const sourceNode = getSourceNode(nodes)(incomingEdge);
          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData },
            { ...getRectangleFromNode(node), ...node.shapeData },
            sourceNode.shapeType,
            node.shapeType,
          );

          upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
        });
      }

      previousNodeHeight.current = node.height;
    },
    [node.height],
  );
};

export default useEnsureEdgePositions;
