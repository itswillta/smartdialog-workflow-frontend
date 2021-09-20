import { Component, createMemo, Show, splitProps } from 'solid-js';

import { EdgeProps, getRectangleFromNode, getSourceNode, useSolidFlowyStoreById } from 'solid-flowy/lib';
import EdgeWithStartIndicator from './EdgeWithStartIndicator';
import { calculateLabelPosition, getFirstSegment, getSegmentDirection } from '../../utils/edges';

const ConditionEdge: Component<EdgeProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'edge', 'storeId']);
  const firstSegment = createMemo(() => getFirstSegment(props.edge.waypoints));
  const firstSegmentDirection = createMemo(() => getSegmentDirection(firstSegment()));
  const [state] = useSolidFlowyStoreById(props.storeId);
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
      label: props.edge.label,
      firstSegmentDirection: firstSegmentDirection(),
      shape: shape(),
      shapeType: sourceNode().shapeType,
      waypoints: props.edge.waypoints,
    })
  );

  return (
    <>
      <EdgeWithStartIndicator edge={props.edge} storeId={props.storeId} {...others} />
      <Show when={!props.edge.isInvalid}>
        <g className="condition-edge__text-group">
          <text
            style={{
              fontWeight: 500,
              userSelect: 'none',
              pointerEvents: 'none',
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

export default ConditionEdge;
