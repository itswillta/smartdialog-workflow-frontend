import { Component } from 'solid-js';
import { NodeContainer, Edge, Node } from 'solid-flowy/lib';
import Tooltip from '../../common/Tooltip/Tooltip';

export interface ExtendedNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  storeId: string;
}

const ExtendedNodeContainer: Component<ExtendedNodeContainerProps> = (props) => {
  return (
    <NodeContainer
      node={props.node}
      additionalEdgeProps={{ ...props.additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'edgeWithStartIndicator' }}
      isHandleDisabled={props.isHandleDisabled}
      storeId={props.storeId}
    >
      {props.children}
    </NodeContainer>
  );
};

export default ExtendedNodeContainer;
