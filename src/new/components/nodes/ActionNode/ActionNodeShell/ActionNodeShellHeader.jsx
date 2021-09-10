import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    background: '#f57f17',
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

const ActionNodeHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <FlashOnIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        Action
      </Typography>
      <IconButton
        className={classes.moreOptionsButton}
        aria-label="more options"
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
    </header>
  );
};

export default React.memo(ActionNodeHeader);
