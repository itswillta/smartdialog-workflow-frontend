import { Component, createMemo } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';
import { useI18n } from '@amoutonbrady/solid-i18n';

import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../App';
import './ActionNodeBody.scss';

interface ActionNodeBodyProps {
  node: Node;
  storeId: string;
}

const ActionNodeBody: Component<ActionNodeBodyProps> = (props) => {
  const [t] = useI18n();
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);
  const { actions } = useWorkflowContext();
  const approvedActions = createMemo(() => actions().filter((intent) => intent.status === 'APPROVED'));

  const handleActionChange = (newActionName: string) => {
    if (props.node.data.intent === newActionName) return;

    const updatedNode = {
      ...props.node,
      data: { ...props.node.data, action: newActionName },
    };

    upsertNode(updatedNode);
  };

  return (
    <main class='action-node-body__main'>
      <Autocomplete
        options={approvedActions()}
        getOptionKey={(option) => option.name as string}
        getOptionLabel={(option) => option.displayName as string}
        value={props.node.data.action}
        onChange={handleActionChange}
        placeholder={t('action')}
      />
    </main>
  );
};

export default ActionNodeBody;
