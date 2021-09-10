import { Component } from 'solid-js';

import InputIcon from '../../../icons/InputIcon';
import IconButton from '../../../common/IconButton/IconButton';
import MoreHorizIcon from '../../../icons/MoreHorizIcon';
import '../IntentNodeHeader.scss';

const IntentNodeShellHeader: Component = () => {
  return (
    <header class='intent-node-header'>
      <InputIcon class='intent-node-header__leading-icon' />
      <h3 class='intent-node-header__title'>Intent</h3>
      <IconButton class='intent-node-header__more-options-button'>
        <MoreHorizIcon class='intent-node-header__more-options-button__icon' />
      </IconButton>
    </header>
  );
};

export default IntentNodeShellHeader;
