import { Component } from 'solid-js';

import IntentNodeShellBody from './IntentNodeShellBody';
import IntentNodeShellHeader from './IntentNodeShellHeader';
import '../IntentNode.scss';

const IntentNode: Component = () => {
  return (
    <div class='intent-node__container'>
      <IntentNodeShellHeader />
      <IntentNodeShellBody />
    </div>
  );
};

export default IntentNode;
