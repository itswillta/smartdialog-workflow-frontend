import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../../..';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
}));

const SubWorkflowNodeShellBody = ({ node }) => {
  const classes = useStyles();
  const { workflows } = useWorkflowContext();

  return (
    <main className={classes.main}>
      <Autocomplete
        options={workflows}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.displayName}
        value={node.data.workflow}
        placeholder="Workflow"
      />
    </main>
  );
};

export default React.memo(SubWorkflowNodeShellBody);
