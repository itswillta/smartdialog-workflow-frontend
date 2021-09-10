import { Component } from 'solid-js';

import Autocomplete from '../../../common/Autocomplete/Autocomplete';
import '../IntentNodeBody.scss';

const IntentNodeBody: Component = () => {
  return (
    <main class='intent-node-body__main'>
      <Autocomplete
        options={[]}
        getOptionKey={(option) => option}
        getOptionLabel={(option) => option}
        value={''}
        placeholder="Intent"
      />
    </main>
  );
};

export default IntentNodeBody;
