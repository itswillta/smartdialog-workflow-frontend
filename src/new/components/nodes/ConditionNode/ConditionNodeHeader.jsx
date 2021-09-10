import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import FilterAltIcon from '../../icons/FilterAlt';
import { useTranslation } from '../../../../../../i18n';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'absolute',
    top: -48,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 1),
    zIndex: 1,
    pointerEvents: 'none',
  },
  leadingIcon: {
    color: '#ffffff',
    width: 20,
    height: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'left',
  },
}));

const ConditionNodeHeader = () => {
  const classes = useStyles();
  const { t } = useTranslation('dialog');

  return (
    <header className={classes.header}>
      <FilterAltIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        {t('condition')}
      </Typography>
    </header>
  );
};

export default React.memo(ConditionNodeHeader);
