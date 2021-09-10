import { Component, createMemo } from 'solid-js';
import { NodeContainer, Edge, Node } from 'solid-flowy/lib';

import ConditionHandles, { ARROW_DISTANCE } from '../../handles/ConditionHandles';

interface ConditionNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  storeId: string;
}

const ConditionNodeContainer: Component<ConditionNodeContainerProps> = (props) => {
  const edgeProps = createMemo(() => ({ ...props.additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'conditionEdge' }));

  return (
    <NodeContainer
      node={props.node}
      additionalEdgeProps={edgeProps()}
      isHandleDisabled={props.isHandleDisabled}
      arrowDistance={ARROW_DISTANCE}
      handles={ConditionHandles}
      storeId={props.storeId}
    >
      {props.children}
    </NodeContainer>
  );
};

export default ConditionNodeContainer;
