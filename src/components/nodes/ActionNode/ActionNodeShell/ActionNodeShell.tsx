import { Component } from 'solid-js';

import ActionNodeShellHeader from './ActionNodeShellHeader';
import ActionNodeShellBody from './ActionNodeShellBody';
import '../ActionNode.scss';

const ActionNode: Component = () => {
  return (
    <div class="action-node__container">
      <ActionNodeShellHeader />
      <ActionNodeShellBody />
    </div>
  );
};

export default ActionNode;
