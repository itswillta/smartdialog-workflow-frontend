import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

import { useStatusStore, WorkflowStatus } from '../../../store/status.store';
import ValidIndicator from '../../icons/ValidIndicator';
import InvalidIndicator from '../../icons/InvalidIndicator';
import ValidStatusPopoverContent from './ValidStatusPopoverContent';
import InvalidStatusPopoverContent from './InvalidStatusPopoverContent';
import WarningStatusPopoverContent from './WarningStatusPopoverContent';
import WarningIndicator from '../../icons/WarningIndicator';

const useStyles = makeStyles(() => ({
  statusIndicatorButton: {
    width: 32,
    height: 32,
    '& .MuiIconButton-label': {
      display: 'grid',
    },
  },
}));

const StatusIndicator = ({ storeId }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const status = useStatusStore(state => state.status);

  const handleOpenPopover = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        className={classes.statusIndicatorButton}
        onClick={handleOpenPopover}
      >
        {status === WorkflowStatus.VALID && <ValidIndicator />}
        {status === WorkflowStatus.INVALID && <InvalidIndicator />}
        {status === WorkflowStatus.WARNING && <WarningIndicator />}
      </IconButton>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {status === WorkflowStatus.VALID && <ValidStatusPopoverContent />}
        {status === WorkflowStatus.INVALID && (
          <InvalidStatusPopoverContent storeId={storeId} />
        )}
        {status === WorkflowStatus.WARNING && <WarningStatusPopoverContent />}
      </Popover>
    </>
  );
};

export default React.memo(StatusIndicator);
