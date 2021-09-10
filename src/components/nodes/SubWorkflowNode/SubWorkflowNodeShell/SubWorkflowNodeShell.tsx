import { Component } from 'solid-js';

import SubWorkflowNodeShellHeader from './SubWorkflowNodeShellHeader';
import SubWorkflowNodeShellBody from './SubWorkflowNodeShellBody';
import '../SubWorkflowNode.scss';

const SubWorkflowNodeShell: Component = () => {
  return (
    <div class="sub-workflow-node__container">
      <SubWorkflowNodeShellHeader />
      <SubWorkflowNodeShellBody />
    </div>
  );
};

export default SubWorkflowNodeShell;
