import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import SyncIcon from '@material-ui/icons/Sync';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

import { useTranslation } from '../../../../../../i18n';
import { useWorkflowContext } from '../../../..';
import { useStatusStore, WorkflowStatus } from '../../../store/status.store';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.grey[700],
    fontSize: 12,
    '& .MuiSvgIcon-root': {
      width: 16,
      height: 16,
      marginRight: theme.spacing(0.5),
    },
    userSelect: 'none',
  },
}));

const SaveStatus = () => {
  const classes = useStyles();
  const { autoSaveStatus } = useWorkflowContext();
  const workflowStatus = useStatusStore(state => state.status);
  const { t } = useTranslation('dialog');

  if (workflowStatus === WorkflowStatus.INVALID || autoSaveStatus === 'error') {
    return (
      <div className={classes.container}>
        <ErrorIcon />
        {t('notSaved')}
      </div>
    );
  }

  if (autoSaveStatus === 'loading') {
    return (
      <div className={classes.container}>
        <SyncIcon />
        {t('saving')}
      </div>
    );
  }

  if (autoSaveStatus === 'success' || !autoSaveStatus) {
    return (
      <div className={classes.container}>
        <DoneIcon />
        {t('saved')}
      </div>
    );
  }

  return <div>{autoSaveStatus}</div>;
};

export default React.memo(SaveStatus);
