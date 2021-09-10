import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ForumIcon from '@material-ui/icons/Forum';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useReactFlowyStoreById } from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    background: '#512da8',
  },
  leadingIcon: {
    color: '#ffffff',
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    flexGrow: 1,
    textAlign: 'left',
  },
  moreOptionsButton: {
    color: '#ffffff',
    width: 24,
    height: 24,
    position: 'absolute',
    right: 8,
  },
}));

const SubWorkflowNodeHeader = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const deleteElementById = useReactFlowyStore(
    state => state.deleteElementById,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation('dialog');

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseMenu();

    if (node) deleteElementById(node.id);
  };

  return (
    <header className={classes.header}>
      <ForumIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        {t('subWorkflow')}
      </Typography>
      <IconButton
        className={classes.moreOptionsButton}
        aria-label="more options"
        onClick={handleOpenMenu}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
      </Menu>
    </header>
  );
};

export default React.memo(SubWorkflowNodeHeader);
