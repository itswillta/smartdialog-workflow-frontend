import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import './GlobalTerminateNode.scss';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';

const GlobalTerminateNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer isHandleDisabled node={props.node} storeId={props.storeId}>
      <div classList={{ 'global-terminate-node--selected': !!props.node.isSelected }}>
        <div class="global-terminate-node__container">
          <div class="global-terminate-node__container__child" />
        </div>
      </div>
    </ExtendedNodeContainer>
  );
};

export default GlobalTerminateNode;
