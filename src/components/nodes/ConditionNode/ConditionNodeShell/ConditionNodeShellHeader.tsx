import { Component } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import FilterAltIcon from '../../../icons/FilterAltIcon';
import '../ConditionNodeHeader.scss';

const ConditionNodeShellHeader: Component = () => {
  const [t] = useI18n();

  return (
    <header class="condition-node-header">
      <FilterAltIcon class="condition-node-header__leading-icon" />
      <h3 class="condition-node-header__title">{t('condition')}</h3>
    </header>
  );
};

export default ConditionNodeShellHeader;
