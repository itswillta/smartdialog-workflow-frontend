import { Component, createMemo, Show } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import SubWorkflowNodeHeader from './SubWorkflowNodeHeader';
import SubWorkflowNodeBody from './SubWorkflowNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import { useStatusStore } from '../../../store/status.store';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import './SubWorkflowNode.scss';

const SubWorkflowNode: Component<NodeComponentProps> = (props) => {
  const [statusState] = useStatusStore();
  const problematicNode = createMemo(() => statusState.problematicNodes.find((pN) => pN.id === props.node.id));

  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'sub-workflow-node--selected': !!props.node.isSelected }}>
        <div class="sub-workflow-node__container">
          <SubWorkflowNodeHeader node={props.node} storeId={props.storeId} />
          <SubWorkflowNodeBody node={props.node} storeId={props.storeId} />
        </div>
        <Show when={statusState.shouldShowInvalidNodes && problematicNode()}>
          <ProblemPopover status={problematicNode().status} message={problematicNode().message} />
        </Show>
      </div>
    </ExtendedNodeContainer>
  );
};

export default SubWorkflowNode;
