import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #434343',
    borderRadius: '50%',
    padding: theme.spacing(1),
    background: 'transparent',
    color: '#fff',
    width: 32,
    height: 32,
    position: 'relative',
  },
}));

const LocalTerminateNodeShell = () => {
  const classes = useStyles();

  return <Paper className={classes.container} elevation={4} />;
};

export default React.memo(LocalTerminateNodeShell);
