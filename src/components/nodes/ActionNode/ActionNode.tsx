import { Component } from 'solid-js';

import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import './ActionNode.scss';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

const ActionNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'action-node--selected': !!props.node.isSelected }}>
        <div class="action-node__container">
          <ActionNodeHeader node={props.node} storeId={props.storeId} />
          <ActionNodeBody node={props.node} storeId={props.storeId} />
        </div>
      </div>
    </ExtendedNodeContainer>
  );
};

export default ActionNode;
