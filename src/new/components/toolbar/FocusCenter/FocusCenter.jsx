import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import { nodesSelector, useReactFlowyStoreById } from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';

const useStyles = makeStyles(theme => ({
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
}));

const FocusCenter = ({ storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const nodes = useReactFlowyStore(nodesSelector);
  const zoomTo = useReactFlowyStore(state => state.zoomTo);
  const translateTo = useReactFlowyStore(state => state.translateTo);
  const { t } = useTranslation('dialog');

  const handleFocusCenter = () => {
    zoomTo(1);

    const firstNode = nodes[0];

    if (!firstNode) return;

    translateTo([firstNode.position.x, firstNode.position.y]);
  };

  return (
    <Tooltip title={t('focusCenter')}>
      <IconButton
        className={clsx(classes.iconButton, classes.mR)}
        onClick={handleFocusCenter}
      >
        <CenterFocusStrongIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FocusCenter;
