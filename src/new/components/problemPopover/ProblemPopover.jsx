import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';

import { useTranslation } from '../../../../../i18n';
import { WorkflowStatus } from '../../store/status.store';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -252,
    width: 240,
    background: '#111',
    borderRadius: 4,
    minHeight: 32,
    padding: theme.spacing(0.75, 1.5),
    display: 'flex',
    alignItems: 'center',
    boxShadow: theme.shadows[4],
    pointerEvents: 'none',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -14,
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: `6px solid #111`,
    pointerEvents: 'none',
  },
  errorIcon: {
    color: '#fa103e',
  },
  warningIcon: {
    color: '#f2994a',
  },
  message: {
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.5),
    textAlign: 'left',
  },
}));

const ProblemPopover = ({ status, message }) => {
  const classes = useStyles();
  const { t } = useTranslation('dialog');

  return (
    <>
      <div className={classes.root}>
        {status === WorkflowStatus.INVALID && (
          <CancelIcon className={classes.errorIcon} fontSize="small" />
        )}
        {status === WorkflowStatus.WARNING && (
          <WarningIcon className={classes.warningIcon} fontSize="small" />
        )}
        <span className={classes.message}>{t(message)}</span>
      </div>
      <span className={classes.arrow} />
    </>
  );
};

export default React.memo(ProblemPopover);
