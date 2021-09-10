import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IntentNodeShellHeader from './IntentNodeShellHeader';
import IntentNodeShellBody from './IntentNodeShellBody';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    borderRadius: 4,
  },
}));

const IntentNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      intent: '',
    },
    shapeType: 'rectangle',
    type: 'intentNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <IntentNodeShellHeader />
      <IntentNodeShellBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(IntentNodeShell);
