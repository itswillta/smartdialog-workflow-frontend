import { Component } from 'solid-js';

import IconButton from '../../../common/IconButton/IconButton';
import ForumIcon from '../../../icons/ForumIcon';
import MoreHorizIcon from '../../../icons/MoreHorizIcon';
import '../SubWorkflowNodeHeader.scss';

const SubWorkflowNodeShellHeader: Component = () => {
  return (
    <header class="sub-workflow-node-header">
      <ForumIcon class="sub-workflow-node-header__leading-icon" />
      <h3 class="sub-workflow-node-header__title">Workflow</h3>
      <IconButton
        class="sub-workflow-node-header__more-options-button"
        aria-label="more options"
      >
        <MoreHorizIcon class="intent-node-header__more-options-button__icon" />
      </IconButton>
    </header>
  );
};

export default SubWorkflowNodeShellHeader;
