import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useReactFlowyStoreById } from 'react-flowy';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../..';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  createNewAction: {
    cursor: 'pointer',
    fontSize: 14,
    padding: theme.spacing(1, 2, 1, 1.5),
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      background: theme.palette.grey[100],
    },
  },
  addIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const SubWorkflowNodeBody = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const { workflows } = useWorkflowContext();
  const approvedWorkflows = useMemo(() =>
    workflows.filter(workflow => workflow.status === 'APPROVED'),
  );

  const handleWorkflowChange = newWorkflowName => {
    if (node.data.workflow === newWorkflowName) return;

    const newNode = {
      ...node,
      data: { ...node.data, workflow: newWorkflowName },
    };

    upsertNode(newNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={approvedWorkflows}
        getOptionKey={option => option.name}
        getOptionLabel={option => option.displayName}
        value={node.data.workflow}
        onChange={handleWorkflowChange}
        placeholder="Workflow"
      />
    </main>
  );
};

export default React.memo(SubWorkflowNodeBody);
