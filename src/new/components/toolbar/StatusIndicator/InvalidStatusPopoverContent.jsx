import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import {
  edgesSelector,
  nodesSelector,
  useReactFlowyStoreById,
} from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';
import InvalidIndicator from '../../icons/InvalidIndicator';
import { useStatusStore } from '../../../store/status.store';
import { autosaveFunctionObject } from '../../../state/autosave';
import { useWorkflowContext } from '../../../..';

const useStyles = makeStyles(theme => ({
  container: {
    width: 280,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(250, 16, 62, 0.05)',
    padding: theme.spacing(1.5, 2),
  },
  title: {
    fontSize: 14,
    marginLeft: theme.spacing(1),
  },
  body: {
    padding: theme.spacing(1.5, 2, 2, 2),
  },
  bodyTitle: {
    fontSize: 12,
    marginBottom: theme.spacing(1),
  },
  bodyDescription: {
    fontSize: 12,
    marginBottom: theme.spacing(1.5),
  },
  showErrorsButton: {
    marginRight: theme.spacing(1.5),
    fontSize: 12,
  },
  forceSaveButton: {
    fontSize: 12,
  },
  blackButton: {
    background: '#111',
    color: theme.palette.common.white,
    '&:hover': {
      background: '#000',
    },
  },
}));

const InvalidStatusPopoverContent = ({ storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const nodes = useReactFlowyStore(nodesSelector);
  const edges = useReactFlowyStore(edgesSelector);
  const shouldShowInvalidNodes = useStatusStore(
    state => state.shouldShowInvalidNodes,
  );
  const setShouldShowInvalidNodes = useStatusStore(
    state => state.setShouldShowInvalidNodes,
  );
  const { autoSaveStatus } = useWorkflowContext();
  const { t } = useTranslation('dialog');

  const handleShowInvalidNodes = () => {
    setShouldShowInvalidNodes(true);
  };

  const handleHideInvalidNodes = () => {
    setShouldShowInvalidNodes(false);
  };

  const forceSave = () => {
    autosaveFunctionObject.handleAutosaveWorkflow([...nodes, ...edges]);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <InvalidIndicator />
        <Typography className={classes.title} variant="h6">
          {t('workflowInvalidTitle')}
        </Typography>
      </header>
      <section className={classes.body}>
        <Typography className={classes.bodyTitle} variant="body1">
          <strong>{t('workflowInvalidSubtitle')}</strong>
        </Typography>
        <Typography className={classes.bodyDescription} variant="body1">
          {t('workflowInvalidDescription')}
        </Typography>
        {shouldShowInvalidNodes && (
          <Button
            className={clsx(classes.showErrorsButton, classes.blackButton)}
            variant="contained"
            onClick={handleHideInvalidNodes}
          >
            {t('hideErrors')}
          </Button>
        )}
        {!shouldShowInvalidNodes && (
          <Button
            className={clsx(classes.showErrorsButton, classes.blackButton)}
            variant="contained"
            onClick={handleShowInvalidNodes}
          >
            {t('showErrors')}
          </Button>
        )}
        <Button
          className={classes.forceSaveButton}
          onClick={forceSave}
          disabled={autoSaveStatus === 'loading'}
        >
          {autoSaveStatus === 'loading' ? t('saving') : t('forceSave')}
        </Button>
      </section>
    </div>
  );
};

export default React.memo(InvalidStatusPopoverContent);
