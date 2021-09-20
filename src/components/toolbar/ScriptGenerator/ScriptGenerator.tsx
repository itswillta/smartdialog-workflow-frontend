import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import { useStatusStore, WorkflowStatus } from '../../../store/status.store';
import { useWorkflowContext, bridgingFunctions } from '../../../App';
import { useSolidFlowyStoreById } from 'solid-flowy/lib';
import Tooltip from '../../common/Tooltip/Tooltip';
import IconButton from '../../common/IconButton/IconButton';
import SaveIcon from '../../icons/SaveIcon';
import './ScriptGenerator.scss';

interface ScriptGeneratorProps {
  storeId: string;
}

const ScriptGenerator: Component<ScriptGeneratorProps> = (props) => {
  const [t] = useI18n();
  const { accessToken, agentId, workflowId, workflowBasicData } = useWorkflowContext();
  const [statusState] = useStatusStore();

  const handleGenerateScripts = async () => {
    if (statusState.status === WorkflowStatus.INVALID || typeof bridgingFunctions.updateWorkflow !== 'function') return;

    const [state] = useSolidFlowyStoreById(props.storeId);

    const nodes = Object.values(state.nodes);
    const edges = Object.values(state.edges);

    const {
      name,
      displayName,
      groupId,
      status,
      hashtag,
      disable,
    } = workflowBasicData();

    const workflowData = {
      name,
      displayName,
      groupId,
      status,
      hashtag,
      disable,
      workflow: [...nodes, ...edges],
    };

    await bridgingFunctions.updateWorkflow(accessToken(), workflowData, agentId(), workflowId());

    bridgingFunctions.fetchWorkflow();

    bridgingFunctions.handleClose();
  };

  return (
    <>
      <Tooltip title={t('saveAndGenerateScripts')}>
        <IconButton
          class="script-generator__icon-button"
          onClick={handleGenerateScripts}
          disabled={statusState.status === WorkflowStatus.INVALID}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ScriptGenerator;
