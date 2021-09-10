import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActionNodeShellHeader from './ActionNodeShellHeader';
import ActionNodeShellBody from './ActionNodeShellBody';

const useStyles = makeStyles(() => ({
  container: {
    borderRadius: 4,
  },
}));

const ActionNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      action: '',
    },
    shapeType: 'rectangle',
    type: 'acttionNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <ActionNodeShellHeader />
      <ActionNodeShellBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(ActionNodeShell);
