import { Component } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import SubWorkflowNodeHeader from './SubWorkflowNodeHeader';
import SubWorkflowNodeBody from './SubWorkflowNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';

const SubWorkflowNode: Component<NodeComponentProps> = (props) => {
  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'sub-workflow-node--selected': !!props.node.isSelected }}>
        <div class="sub-workflow-node__container">
          <SubWorkflowNodeHeader node={props.node} storeId={props.storeId} />
          <SubWorkflowNodeBody node={props.node} storeId={props.storeId} />
        </div>
      </div>
    </ExtendedNodeContainer>
  );
};

export default SubWorkflowNode;
