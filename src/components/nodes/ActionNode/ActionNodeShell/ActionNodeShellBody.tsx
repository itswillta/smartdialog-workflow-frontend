import { Component } from 'solid-js';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import '../ActionNodeBody.scss';

const ActionNodeShellBody: Component = () => {
  return (
    <main class='action-node-body__main'>
      <Autocomplete
        options={[]}
        getOptionKey={(option) => option}
        getOptionLabel={(option) => option}
        value={''}
        placeholder="Action"
      />
    </main>
  );
};

export default ActionNodeShellBody;
