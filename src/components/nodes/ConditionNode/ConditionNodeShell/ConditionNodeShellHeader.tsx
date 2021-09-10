import { Component } from 'solid-js';

import FilterAltIcon from '../../../icons/FilterAltIcon';
import '../ConditionNodeHeader.scss';

const ConditionNodeShellHeader: Component = () => {
  return (
    <header class="condition-node-header">
      <FilterAltIcon class="condition-node-header__leading-icon" />
      <h3 class="condition-node-header__title">Condition</h3>
    </header>
  );
};

export default ConditionNodeShellHeader;
