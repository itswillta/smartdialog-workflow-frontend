import { Component, createEffect, createMemo, Show } from 'solid-js';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';

import IntentNodeBody from './IntentNodeBody';
import IntentNodeHeader from './IntentNodeHeader';
import ExtendedNodeContainer from '../NodeContainer/ExtendedNodeContainer';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';
import './IntentNode.scss';

const IntentNode: Component<NodeComponentProps> = (props) => {
  const [statusState] = useStatusStore();
  const problematicNode = createMemo(() => statusState.problematicNodes.find((pN) => pN.id === props.node.id));

  return (
    <ExtendedNodeContainer node={props.node} storeId={props.storeId}>
      <div classList={{ 'intent-node--selected': !!props.node.isSelected }}>
        <div class="intent-node__container">
          <IntentNodeHeader node={props.node} storeId={props.storeId} />
          <IntentNodeBody node={props.node} storeId={props.storeId} />
        </div>
        <Show when={statusState.shouldShowInvalidNodes && problematicNode()}>
          <ProblemPopover status={problematicNode().status} message={problematicNode().message} />
        </Show>
      </div>
    </ExtendedNodeContainer>
  );
};

export default IntentNode;
