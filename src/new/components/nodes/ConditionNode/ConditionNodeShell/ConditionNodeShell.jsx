import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ConditionNodeShellHeader from './ConditionNodeShellHeader';
import ConditionNodeShellBody from './ConditionNodeShellBody';

const useStyles = makeStyles(() => ({
  container: {
    boxShadow: '0px 2px 4px 1px rgb(0 0 0 / 20%)',
    borderRadius: 4,
  },
}));

const ConditionNodeShell = () => {
  const classes = useStyles();

  const shellNode = {
    id: '?',
    position: { x: 0, y: 0 },
    data: {
      conditions: [],
    },
    shapeType: 'hexagon',
    type: 'conditionNode',
  };

  return (
    <Paper className={classes.container} elevation={0}>
      <svg
        style={{
          position: 'absolute',
          top: -39,
          left: 0,
          filter: 'drop-shadow(rgba(0, 0, 0, 0.1) 0px -1px 2px)',
        }}
        width="366"
        height="40"
        viewBox="0 0 366 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M183 0L366 40H0 0Z" fill="#ffffff" fillOpacity="1" />
        <path d="M183 0L366 40H0 0Z" fill="#2e7d32" fillOpacity="1" />
      </svg>
      <svg
        style={{
          position: 'absolute',
          bottom: -39,
          left: 0,
          filter: 'drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)',
        }}
        width="366"
        height="40"
        viewBox="0 0 366 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M183 40L0 0L366 0L183 40Z" fill="#ffffff" fillOpacity="1" />
      </svg>
      <ConditionNodeShellHeader node={shellNode} />
      <ConditionNodeShellBody node={shellNode} />
    </Paper>
  );
};

export default React.memo(ConditionNodeShell);
