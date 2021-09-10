import { Component } from 'solid-js';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';

const SubWorkflowNodeShellBody: Component = () => {
  return (
    <main class="sub-workflow-node-body__main">
      <Autocomplete
        options={[]}
        getOptionKey={option => option}
        getOptionLabel={option => option}
        value={''}
        placeholder="Workflow"
      />
    </main>
  );
};

export default SubWorkflowNodeShellBody;
