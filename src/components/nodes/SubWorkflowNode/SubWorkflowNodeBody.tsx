import { Component, createMemo } from 'solid-js';
import { Node, useSolidFlowyStoreById } from 'solid-flowy/lib';
import { useI18n } from '@amoutonbrady/solid-i18n';

import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../App';
import './SubWorkflowNodeBody.scss';

interface SubWorkflowNodeBodyProps {
  node: Node;
  storeId: string;
}

const SubWorkflowNodeBody: Component<SubWorkflowNodeBodyProps> = (props) => {
  const [t] = useI18n();
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);
  const { workflows } = useWorkflowContext();
  const approvedWorkflows = createMemo(() => workflows().filter((workflow) => workflow.status === 'APPROVED'));

  const handleWorkflowChange = (newWorkflowName: string) => {
    if (props.node.data.workflow === newWorkflowName) return;

    const newNode = {
      ...props.node,
      data: { ...props.node.data, workflow: newWorkflowName },
    };

    upsertNode(newNode);
  };

  return (
    <main class="sub-workflow-node-body__main">
      <Autocomplete
        options={approvedWorkflows()}
        getOptionKey={(option) => option.name}
        getOptionLabel={(option) => option.displayName}
        value={props.node.data.workflow}
        onChange={handleWorkflowChange}
        placeholder={t('subWorkflow')}
      />
    </main>
  );
};

export default SubWorkflowNodeBody;
