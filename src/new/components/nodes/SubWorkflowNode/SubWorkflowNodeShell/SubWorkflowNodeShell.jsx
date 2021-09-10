import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import SubWorkflowNodeShellHeader from './SubWorkflowNodeShellHeader';
import SubWorkflowNodeShellBody from './SubWorkflowNodeShellBody';

const useStyles = makeStyles(() => ({
  container: {
    border: '2px solid #434343',
    borderRadius: 4,
  },
}));

const SubWorkflowNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      workflow: '',
    },
    shapeType: 'rectangle',
    type: 'subWorkflowNode',
  };

  return (
    <Paper className={classes.container} elevation={4}>
      <SubWorkflowNodeShellHeader />
      <SubWorkflowNodeShellBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(SubWorkflowNodeShell);
