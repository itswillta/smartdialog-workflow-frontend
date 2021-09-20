import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import '../IntentNodeBody.scss';

const IntentNodeBody: Component = () => {
  const [t] = useI18n();

  return (
    <main class='intent-node-body__main'>
      <Autocomplete
        options={[]}
        getOptionKey={(option) => option}
        getOptionLabel={(option) => option}
        value={''}
        placeholder={t('intent')}
      />
    </main>
  );
};

export default IntentNodeBody;
