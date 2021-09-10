import { Component, createMemo, For, Show } from 'solid-js';
import { Node } from 'solid-flowy/lib';

import ConditionRow from './ConditionRow';
import './ConditionNodeBody.scss';

interface ConditionTableProps {
  node: Node;
  storeId: string;
}

const ConditionTable: Component<ConditionTableProps> = (props) => {
  const conditions = createMemo(() =>
    props.node.data && Array.isArray(props.node.data.conditions) ? props.node.data.conditions : []
  );

  return (
    <table class="condition-node-body__table" aria-label="condition table">
      <tbody>
        <For each={conditions()}>
          {(condition, index) => (
            <ConditionRow
              node={props.node}
              condition={condition as Record<string, unknown>}
              index={index()}
              isLastRow={index() === conditions().length - 1}
              isTheOnlyRow={conditions().length === 1}
              storeId={props.storeId}
            />
          )}
        </For>
      </tbody>
    </table>
  );
};

interface ConditionNodeBodyProps {
  node: Node;
  storeId: string;
}

const ConditionNodeBody: Component<ConditionNodeBodyProps> = (props) => {
  return (
    <main class='condition-node-body'>
      <ConditionTable node={props.node} storeId={props.storeId} />
    </main>
  );
};

export default ConditionNodeBody;
