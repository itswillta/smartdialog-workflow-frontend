import React, { useMemo } from 'react';

import {
  getRectangleFromNode,
  getSourceNode,
  nodesSelector,
  useReactFlowyStoreById,
} from 'react-flowy';
import EdgeWithStartIndicator from './EdgeWithStartIndicator';
import {
  calculateLabelPosition,
  getFirstSegment,
  getSegmentDirection,
} from '../../utils/edges';

export default React.memo(({ edge, storeId, ...rest }) => {
  const { id, label, source, target, waypoints, isInvalid } = edge;
  const firstSegment = getFirstSegment(waypoints);
  const firstSegmentDirection = getSegmentDirection(firstSegment);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const nodes = useReactFlowyStore(nodesSelector);
  const sourceNode = getSourceNode(nodes)({ id, source, target, waypoints });
  const shape = {
    ...getRectangleFromNode(sourceNode),
    ...sourceNode.shapeData,
  };

  const { textX, textY } = useMemo(
    () =>
      calculateLabelPosition({
        label,
        firstSegmentDirection,
        shape,
        shapeType: sourceNode.shapeType,
        waypoints,
      }),
    [waypoints, sourceNode.shapeType, shape],
  );

  return (
    <>
      <EdgeWithStartIndicator edge={edge} storeId={storeId} {...rest} />
      {!isInvalid && (
        <g className="condition-edge__text-group">
          <text
            style={{
              fontWeight: 500,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            x={textX}
            y={textY}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
});
