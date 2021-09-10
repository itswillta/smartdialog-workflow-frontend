import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from '../../../../../../i18n';
import ValidIndicator from '../../icons/ValidIndicator';

const useStyles = makeStyles(theme => ({
  container: {
    width: 280,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(33, 150, 83, 0.05)',
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
  },
}));

const ValidStatusPopoverContent = () => {
  const classes = useStyles();
  const { t } = useTranslation('dialog');

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <ValidIndicator />
        <Typography className={classes.title} variant="h6">
          {t('workflowValidTitle')}
        </Typography>
      </header>
      <section className={classes.body}>
        <Typography className={classes.bodyTitle} variant="body1">
          <strong>{t('workflowValidSubtitle')}</strong>
        </Typography>
        <Typography className={classes.bodyDescription} variant="body1">
          {t('workflowValidDescription')}
        </Typography>
      </section>
    </div>
  );
};

export default React.memo(ValidStatusPopoverContent);
