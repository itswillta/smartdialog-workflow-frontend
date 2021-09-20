import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import '../ActionNodeBody.scss';

const ActionNodeShellBody: Component = () => {
  const [t] = useI18n();

  return (
    <main class='action-node-body__main'>
      <Autocomplete
        options={[]}
        getOptionKey={(option) => option}
        getOptionLabel={(option) => option}
        value={''}
        placeholder={t('action')}
      />
    </main>
  );
};

export default ActionNodeShellBody;
