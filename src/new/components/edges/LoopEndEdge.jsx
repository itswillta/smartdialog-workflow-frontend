import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
  getRectangleFromNode,
  getSourceNode,
  nodesSelector,
  StandardEdgeController,
  getMarkerEnd,
  useReactFlowyStoreById,
  getPathFromWaypoints,
} from 'react-flowy';

import {
  calculateLabelPosition,
  getFirstSegment,
  getSegmentDirection,
} from '../../utils/edges';

export default React.memo(({ edge, storeId }) => {
  const {
    id,
    label,
    source,
    target,
    waypoints,
    isInvalid,
    style,
    arrowHeadType,
    isForming,
    isSelected,
  } = edge;
  const firstSegment = getFirstSegment(waypoints);
  const firstSegmentDirection = getSegmentDirection(firstSegment);
  const markerEnd = getMarkerEnd(arrowHeadType);
  const errorMarkerEnd = getMarkerEnd(`${arrowHeadType}--error`);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const nodes = useReactFlowyStore(nodesSelector);
  const sourceNode = getSourceNode(nodes)({ id, source, target, waypoints });
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
  const shape = {
    ...getRectangleFromNode(sourceNode),
    ...sourceNode.shapeData,
  };

  const { textX, textY } = useMemo(
    () =>
      calculateLabelPosition({
        label: label || '',
        firstSegmentDirection,
        shape,
        shapeType: sourceNode.shapeType,
        waypoints,
      }),
    [label, firstSegmentDirection, waypoints, sourceNode.shapeType, shape],
  );

  useEffect(
    () => {
      if (typeof sourceNode.data.loopCount !== 'number') return;

      if (edge.label === `Loop count > ${sourceNode.data.loopCount}`) return;

      upsertEdge({
        ...edge,
        label: `Loop count > ${sourceNode.data.loopCount}`,
      });
    },
    [edge, sourceNode.data.loopCount],
  );

  return (
    <>
      <circle
        className={clsx(
          'edge__start-indicator',
          'edge__start-indicator--loop-end',
          isInvalid ? 'edge__start-indicator--invalid' : '',
        )}
        cx={waypoints[0].x}
        cy={waypoints[0].y}
        r="4"
      />
      <path
        style={style}
        className={clsx(
          'react-flowy__edge-path',
          'react-flowy__edge-path--loop-end',
          isForming ? 'react-flowy__edge-path--forming' : '',
          isSelected ? 'react-flowy__edge-path--selected' : '',
          isInvalid ? 'react-flowy__edge-path--invalid' : '',
        )}
        d={getPathFromWaypoints(waypoints)}
        markerEnd={isInvalid ? errorMarkerEnd : markerEnd}
      />
      {!isForming && <StandardEdgeController edge={edge} storeId={storeId} />}
      {!isInvalid && (
        <g className="loop-end-edge__text-group">
          <text
            style={{
              color: 'purple',
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
