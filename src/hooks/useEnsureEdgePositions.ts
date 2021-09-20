import {
  connectShapes,
  getIncomingEdges,
  getOutgoingEdges,
  getRectangleFromNode,
  getSourceNode,
  getTargetNode,
  useSolidFlowyStoreById,
  Node,
} from 'solid-flowy/lib';
import { createEffect } from 'solid-js';

const useEnsureEdgePositions = ({ node, storeId }: { node: Node, storeId: string }) => {
  let previousNodeHeight: number = node.height;
  const [state, { upsertEdge }] = useSolidFlowyStoreById(storeId);

  createEffect(
    () => {
      if (!previousNodeHeight) {
        previousNodeHeight = node.height;

        return;
      }

      if (node.height < previousNodeHeight) {
        getOutgoingEdges(storeId)(node).forEach(outcomingEdge => {
          if (outcomingEdge.waypoints[0].y <= node.position.y + node.height)
            return;

          const targetNode = getTargetNode(storeId)(outcomingEdge);

          if (!targetNode) return;

          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(node), ...node.shapeData },
            { ...getRectangleFromNode(targetNode), ...targetNode.shapeData },
            node.shapeType,
            targetNode.shapeType,
          );

          upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
        });

        getIncomingEdges(storeId)(node).forEach(incomingEdge => {
          if (
            incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y <=
            node.position.y + node.height
          )
            return;

          const sourceNode = getSourceNode(storeId)(incomingEdge);

          if (!sourceNode) return;

          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData },
            { ...getRectangleFromNode(node), ...node.shapeData },
            sourceNode.shapeType,
            node.shapeType,
          );

          upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
        });
      } else if (node.height > previousNodeHeight) {
        getOutgoingEdges(storeId)(node).forEach(outcomingEdge => {
          if (
            outcomingEdge.waypoints[0].y <
            node.position.y + previousNodeHeight
          )
            return;
          const targetNode = getTargetNode(storeId)(outcomingEdge);

          if (!targetNode) return;

          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(node), ...node.shapeData },
            { ...getRectangleFromNode(targetNode), ...targetNode.shapeData },
            node.shapeType,
            targetNode.shapeType,
          );

          upsertEdge({ ...outcomingEdge, waypoints: newWaypoints });
        });

        getIncomingEdges(storeId)(node).forEach(incomingEdge => {
          if (
            incomingEdge.waypoints[incomingEdge.waypoints.length - 1].y <
            node.position.y + previousNodeHeight
          )
            return;

          const sourceNode = getSourceNode(storeId)(incomingEdge);

          if (!sourceNode) return;

          const newWaypoints = connectShapes(
            { ...getRectangleFromNode(sourceNode), ...sourceNode.shapeData },
            { ...getRectangleFromNode(node), ...node.shapeData },
            sourceNode.shapeType,
            node.shapeType,
          );

          upsertEdge({ ...incomingEdge, waypoints: newWaypoints });
        });
      }

      previousNodeHeight = node.height;
    }
  );
};

export default useEnsureEdgePositions;
