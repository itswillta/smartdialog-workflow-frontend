import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import './LocalTerminateNode.scss';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';

const LocalTerminateNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer isHandleDisabled node={props.node} storeId={props.storeId}>
      <div classList={{ 'local-terminate-node--selected': !!props.node.isSelected }}>
        <div class="local-terminate-node__container" />
      </div>
    </ExtendedNodeContainer>
  );
};

export default LocalTerminateNode;
