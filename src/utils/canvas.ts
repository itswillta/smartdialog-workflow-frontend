import { TRBL, useSolidFlowyStoreById } from 'solid-flowy/lib';

export const getCanvasBounding = ({ storeId }: { storeId: string }): TRBL => {
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  const [state] = useSolidFlowyStoreById(storeId);

  Object.values(state.nodes).forEach(node => {
    if (node.position.x < left) left = node.position.x;
    if (node.position.y < top) top = node.position.y;
    if (node.width && node.position.x + node.width > right)
      right = node.position.x + node.width;
    if (node.height && node.position.y + node.height > bottom)
      bottom = node.position.y + node.height;

    if (node.shapeType === 'hexagon' && node.shapeData) {
      if (
        node.shapeData.topPeakHeight &&
        node.position.y - (node.shapeData.topPeakHeight as number) < top
      )
        top = node.position.y - (node.shapeData.topPeakHeight as number);

      if (
        node.shapeData.bottomPeakHeight &&
        node.position.y + node.height + (node.shapeData.bottomPeakHeight as number) > bottom
      )
        bottom =
          node.position.y + node.height + (node.shapeData.bottomPeakHeight as number);
    }
  });

  Object.values(state.edges).forEach(edge => {
    edge.waypoints.forEach(waypoint => {
      if (waypoint.x < left) left = waypoint.x;
      else if (waypoint.x > right) right = waypoint.x;
      if (waypoint.y < top) top = waypoint.y;
      else if (waypoint.y > bottom) bottom = waypoint.y;
    });
  });

  return { left, top, right, bottom };
};
