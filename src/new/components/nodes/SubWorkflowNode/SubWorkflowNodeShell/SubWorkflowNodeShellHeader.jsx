import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ForumIcon from '@material-ui/icons/Forum';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

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

const SubWorkflowNodeHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <ForumIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        Workflow
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

export default React.memo(SubWorkflowNodeHeader);
