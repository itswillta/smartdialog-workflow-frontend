import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useReactFlowyStoreById } from 'react-flowy';
import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../..';
import { useTranslation } from '../../../../../../i18n';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
}));

const IntentNodeBody = ({ node, storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const { intents } = useWorkflowContext();
  const { t } = useTranslation('dialog');

  const approvedIntents = useMemo(
    () => intents.filter(intent => intent.status === 'APPROVED'),
    [intents],
  );

  const handleActionChange = newIntentName => {
    if (node.data.intent === newIntentName) return;

    const updatedNode = {
      ...node,
      data: { ...node.data, intent: newIntentName },
    };

    upsertNode(updatedNode);
  };

  return (
    <main className={classes.main}>
      <Autocomplete
        options={approvedIntents}
        getOptionKey={option => option.name}
        getOptionLabel={option => option.displayName}
        value={node.data.intent}
        onChange={handleActionChange}
        placeholder={t('intent')}
      />
    </main>
  );
};

export default React.memo(IntentNodeBody);
