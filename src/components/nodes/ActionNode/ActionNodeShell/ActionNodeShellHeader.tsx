import { Component } from 'solid-js';

import FlashIcon from '../../../icons/FlashIcon';
import IconButton from '../../../common/IconButton/IconButton';
import MoreHorizIcon from '../../../icons/MoreHorizIcon';
import '../ActionNodeHeader.scss';


const ActionNodeShellHeader: Component = () => {
  return (
    <header class='action-node-header'>
      <FlashIcon class='action-node-header__leading-icon' />
      <h3 class='action-node-header__title'>Action</h3>
      <IconButton class='action-node-header__more-options-button'>
        <MoreHorizIcon class='action-node-header__more-options-button__icon' />
      </IconButton>
    </header>
  );
};

export default ActionNodeShellHeader;
