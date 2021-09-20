import { Component, createMemo, Show } from 'solid-js';

import ActionNodeHeader from './ActionNodeHeader';
import ActionNodeBody from './ActionNodeBody';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';
import { useStatusStore } from '../../../store/status.store';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import './ActionNode.scss';

const ActionNode: Component<NodeComponentProps> = (props) => {
  const [statusState] = useStatusStore();
  const problematicNode = createMemo(() => statusState.problematicNodes.find((pN) => pN.id === props.node.id));

  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'action-node--selected': !!props.node.isSelected }}>
        <div class="action-node__container">
          <ActionNodeHeader node={props.node} storeId={props.storeId} />
          <ActionNodeBody node={props.node} storeId={props.storeId} />
        </div>
        <Show when={statusState.shouldShowInvalidNodes && problematicNode()}>
          <ProblemPopover status={problematicNode().status} message={problematicNode().message} />
        </Show>
      </div>
    </ExtendedNodeContainer>
  );
};

export default ActionNode;
