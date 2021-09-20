import { Component, createEffect, createMemo, Show } from 'solid-js';
import {
  EdgeProps,
  getMarkerEnd,
  getPathFromWaypoints,
  getRectangleFromNode,
  getSourceNode,
  useSolidFlowyStoreById,
} from 'solid-flowy/lib';
import StandardEdgeController from 'solid-flowy/lib/premade/components/Edges/StandardEdgeController';

import { calculateLabelPosition, getFirstSegment, getSegmentDirection } from '../../utils/edges';

const LoopEndEdge: Component<EdgeProps> = (props) => {
  const firstSegment = createMemo(() => getFirstSegment(props.edge.waypoints));
  const firstSegmentDirection = createMemo(() => getSegmentDirection(firstSegment()));
  const markerEnd = createMemo(() => getMarkerEnd(props.edge.arrowHeadType));
  const errorMarkerEnd = createMemo(() => getMarkerEnd(`${props.edge.arrowHeadType}--error`));
  const [state, { upsertEdge }] = useSolidFlowyStoreById(props.storeId);
  const sourceNode = createMemo(() =>
    getSourceNode(props.storeId)({
      id: props.edge.id,
      source: props.edge.source,
      target: props.edge.target,
      waypoints: props.edge.waypoints,
    })
  );
  const shape = createMemo(() => ({
    ...getRectangleFromNode(sourceNode()),
    ...sourceNode().shapeData,
  }));

  const textPosition = createMemo(() =>
    calculateLabelPosition({
      label: props.edge.label || '',
      firstSegmentDirection: firstSegmentDirection(),
      shape: shape(),
      shapeType: sourceNode().shapeType,
      waypoints: props.edge.waypoints,
    })
  );

  createEffect(() => {
    if (typeof sourceNode().data.loopCount !== 'number') return;

    if (props.edge.label === `Loop count > ${sourceNode().data.loopCount}`) return;

    upsertEdge({
      ...props.edge,
      label: `Loop count > ${sourceNode().data.loopCount}`,
    });
  });

  return (
    <>
      <circle
        classList={{
          'edge__start-indicator': true,
          'edge__start-indicator--loop-end': true,
          'edge__start-indicator--invalid': !!props.edge.isInvalid,
        }}
        cx={props.edge.waypoints[0].x}
        cy={props.edge.waypoints[0].y}
        r="4"
      />
      <path
        style={props.edge.style}
        classList={{
          'solid-flowy__edge-path': true,
          'solid-flowy__edge-path--loop-end': true,
          'solid-flowy__edge-path--forming': !!props.edge.isForming,
          'solid-flowy__edge-path--selected': !!props.edge.isSelected,
          'solid-flowy__edge-path--invalid': !!props.edge.isInvalid,
        }}
        d={getPathFromWaypoints(props.edge.waypoints) as string}
        marker-end={props.edge.isInvalid ? errorMarkerEnd() : markerEnd()}
      />
      <Show when={!props.edge.isForming}>
        <StandardEdgeController edge={props.edge} storeId={props.storeId} />
      </Show>
      <Show when={!props.edge.isInvalid}>
        <g className="loop-end-edge__text-group">
          <text
            style={{
              fill: 'purple',
              'font-weight': 500,
              'user-select': 'none',
              'pointer-events': 'none',
            }}
            x={textPosition().textX}
            y={textPosition().textY}
          >
            {props.edge.label}
          </text>
        </g>
      </Show>
    </>
  );
};

export default LoopEndEdge;
