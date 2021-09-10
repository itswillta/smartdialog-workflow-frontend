import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import './StartNode.scss'

const StartNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'start-node--selected': !!props.node.isSelected }}>
        <div class='start-node__container' />
      </div>
    </ExtendedNodeContainer>
  );
};

export default StartNode;
