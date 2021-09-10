import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from '../../../../../../i18n';
import WarningIndicator from '../../icons/WarningIndicator';
import { useStatusStore } from '../../../store/status.store';

const useStyles = makeStyles(theme => ({
  container: {
    width: 320,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(242, 153, 74, 0.05)',
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

const WarningStatusPopoverContent = () => {
  const classes = useStyles();
  const shouldShowUnhandledConditions = useStatusStore(
    state => state.shouldShowUnhandledConditions,
  );
  const setShouldShowUnhandledConditions = useStatusStore(
    state => state.setShouldShowUnhandledConditions,
  );
  const { t } = useTranslation('dialog');

  const handleShowUnhandledConditions = () => {
    setShouldShowUnhandledConditions(true);
  };

  const handleHideUnhandledConditions = () => {
    setShouldShowUnhandledConditions(false);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <WarningIndicator />
        <Typography className={classes.title} variant="h6">
          {t('workflowWarningTitle')}
        </Typography>
      </header>
      <section className={classes.body}>
        <Typography className={classes.bodyTitle} variant="body1">
          <strong>{t('workflowWarningSubtitle')}</strong>
        </Typography>
        <Typography className={classes.bodyDescription} variant="body1">
          {t('workflowWarningDescription')}
        </Typography>
        {shouldShowUnhandledConditions && (
          <Button
            className={clsx(classes.showErrorsButton, classes.blackButton)}
            variant="contained"
            onClick={handleHideUnhandledConditions}
          >
            {t('hideWarnings')}
          </Button>
        )}
        {!shouldShowUnhandledConditions && (
          <Button
            className={clsx(classes.showErrorsButton, classes.blackButton)}
            variant="contained"
            onClick={handleShowUnhandledConditions}
          >
            {t('showWarnings')}
          </Button>
        )}
      </section>
    </div>
  );
};

export default React.memo(WarningStatusPopoverContent);
