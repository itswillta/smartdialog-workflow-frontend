import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ActionAutocomplete from '../ActionAutocomplete';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
}));

const ActionNodeShellBody = ({ node }) => {
  const classes = useStyles();

  return (
    <>
      <main className={classes.main}>
        <ActionAutocomplete node={node} value={node.data.action} />
      </main>
    </>
  );
};

export default React.memo(ActionNodeShellBody);
