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
  child: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#434343',
  },
}));

const GlobalTerminateNodeShell = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.container} elevation={4}>
      <Paper className={classes.child} elevation={0} />
    </Paper>
  );
};

export default React.memo(GlobalTerminateNodeShell);
