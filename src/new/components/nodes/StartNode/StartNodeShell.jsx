import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#434343',
    padding: theme.spacing(1),
    color: '#fff',
    width: 32,
    height: 32,
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
    borderRadius: '50%',
  },
}));

const StartNode = () => {
  const classes = useStyles();

  return <Paper className={classes.container} elevation={4} />;
};

export default React.memo(StartNode);
