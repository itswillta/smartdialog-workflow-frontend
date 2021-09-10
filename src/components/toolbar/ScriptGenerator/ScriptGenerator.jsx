import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import { useReactFlowyStoreById } from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';
import { useWorkflowContext } from '../../../..';
import { useStatusStore, WorkflowStatus } from '../../../store/status.store';
import { updateWorkflow } from '../../../../../../apis/workflow';

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
}));

const ScriptGenerator = ({
  handleClose,
  workflowBasicData,
  workflowId,
  fetchWorkflow,
  agentId,
  storeId,
}) => {
  const classes = useStyles();
  const { accessToken } = useWorkflowContext();
  const workflowStatus = useStatusStore(state => state.status);
  const { t } = useTranslation('dialog');

  const handleGenerateScripts = async () => {
    if (workflowStatus === WorkflowStatus.INVALID) return;

    const useReactFlowyStore = useReactFlowyStoreById(storeId);

    const { nodes, edges } = useReactFlowyStore.getState();

    const {
      name,
      displayName,
      groupId,
      status,
      hashtag,
      disable,
    } = workflowBasicData;

    const workflowData = {
      name,
      displayName,
      groupId,
      status,
      hashtag,
      disable,
      workflow: [...nodes, ...edges],
    };

    await updateWorkflow(accessToken, workflowData, agentId, workflowId);

    fetchWorkflow();

    handleClose();
  };

  return (
    <>
      <Tooltip title={t('saveAndGenerateScripts')}>
        <IconButton
          className={clsx(classes.iconButton, classes.mR)}
          onClick={handleGenerateScripts}
          disabled={workflowStatus === WorkflowStatus.INVALID}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default React.memo(ScriptGenerator);
