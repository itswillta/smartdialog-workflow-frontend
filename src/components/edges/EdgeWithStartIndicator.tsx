import { StandardEdge, EdgeProps } from 'solid-flowy/lib';
import { Component, splitProps } from 'solid-js';

const EdgeWithStartIndicator: Component<EdgeProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'edge', 'storeId']);

  return (
    <>
      <circle cx={props.edge.waypoints[0].x} cy={props.edge.waypoints[0].y} r="4" />
      <StandardEdge edge={props.edge} storeId={props.storeId} {...others} />
    </>
  );
};

export default EdgeWithStartIndicator;
