import { useI18n } from '@amoutonbrady/solid-i18n';
import { Component } from 'solid-js';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';

const SubWorkflowNodeShellBody: Component = () => {
  const [t] = useI18n();

  return (
    <main class="sub-workflow-node-body__main">
      <Autocomplete
        options={[]}
        getOptionKey={(option) => option}
        getOptionLabel={(option) => option}
        value={''}
        placeholder={t('subWorkflow')}
      />
    </main>
  );
};

export default SubWorkflowNodeShellBody;
