import React, { useMemo } from 'react';

import Autocomplete from '../../common/Autocomplete/Autocomplete';
import { useWorkflowContext } from '../../../..';
import { useTranslation } from '../../../../../../i18n';

const ActionAutocomplete = ({ value, onChange }) => {
  const { actions } = useWorkflowContext();
  const { t } = useTranslation('dialog');

  const approvedActions = useMemo(
    () => actions.filter(action => action.status === 'APPROVED'),
    [actions],
  );

  return (
    <>
      <Autocomplete
        options={approvedActions}
        getOptionKey={option => option.name}
        getOptionLabel={option => option.displayName}
        value={value}
        onChange={onChange}
        placeholder={t('action')}
      />
    </>
  );
};

export default React.memo(ActionAutocomplete);
