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

const IntentNodeShellBody = ({ node }) => {
  const classes = useStyles();
  const { intents } = useWorkflowContext();

  return (
    <main className={classes.main}>
      <Autocomplete
        options={intents}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.displayName}
        value={node.data.intent}
        placeholder="Intent"
      />
    </main>
  );
};

export default React.memo(IntentNodeShellBody);
