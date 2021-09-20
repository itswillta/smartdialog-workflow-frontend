import { Component, createMemo } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';

import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../App';
import './IntentNodeBody.scss';
import { useI18n } from '@amoutonbrady/solid-i18n';

interface IntentNodeBodyProps {
  node: Node;
  storeId: string;
}

const IntentNodeBody: Component<IntentNodeBodyProps> = (props) => {
  const [t] = useI18n();
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);
  const { intents } = useWorkflowContext();
  const approvedIntents = createMemo(() => intents().filter((intent) => intent.status === 'APPROVED'));

  const handleActionChange = (newIntentName: string) => {
    if (props.node.data.intent === newIntentName) return;

    const updatedNode = {
      ...props.node,
      data: { ...props.node.data, intent: newIntentName },
    };

    upsertNode(updatedNode);
  };

  return (
    <main class="intent-node-body__main">
      <Autocomplete
        options={approvedIntents()}
        getOptionKey={(option) => option.name as string}
        getOptionLabel={(option) => option.displayName as string}
        value={props.node.data.intent}
        onChange={handleActionChange}
        placeholder={t('intent')}
      />
    </main>
  );
};

export default IntentNodeBody;
