import { StandardEdge, EdgeProps } from 'solid-flowy/lib';
import { Component, splitProps } from 'solid-js';

const EdgeWithStartIndicator: Component<EdgeProps> = (props) => {
  console.log('EdgeWithStartIndicator props', { ...props });
  const [local, others] = splitProps(props, ['children', 'edge', 'storeId']);

  return (
    <>
      <circle
        classList={{ 'edge__start-indicator': true, 'edge__start-indicator--invalid': !!props.edge.isInvalid }}
        cx={props.edge.waypoints[0].x}
        cy={props.edge.waypoints[0].y}
        r="4"
      />
      <StandardEdge edge={props.edge} storeId={props.storeId} {...others} />
    </>
  );
};

export default EdgeWithStartIndicator;
