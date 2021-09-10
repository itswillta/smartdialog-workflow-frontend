import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useReactFlowyStoreById } from 'react-flowy';
import ActionAutocomplete from './ActionAutocomplete';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
}));

const ActionNodeBody = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);

  const handleActionChange = newActionName => {
    if (node.data.action === newActionName) return;

    const newNode = { ...node, data: { ...node.data, action: newActionName } };

    upsertNode(newNode);
  };

  return (
    <>
      <main className={classes.main}>
        <ActionAutocomplete
          node={node}
          value={node.data.action}
          onChange={handleActionChange}
        />
      </main>
    </>
  );
};

export default React.memo(ActionNodeBody);
