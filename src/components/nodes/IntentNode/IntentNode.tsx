import { Component, createEffect } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import IntentNodeBody from './IntentNodeBody';
import IntentNodeHeader from './IntentNodeHeader';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import './IntentNode.scss';

const IntentNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'intent-node--selected': !!props.node.isSelected }}>
        <div class='intent-node__container'>
          <IntentNodeHeader node={props.node} storeId={props.storeId} />
          <IntentNodeBody node={props.node} storeId={props.storeId} />
        </div>
      </div>
    </ExtendedNodeContainer>
  );
};

export default IntentNode;
