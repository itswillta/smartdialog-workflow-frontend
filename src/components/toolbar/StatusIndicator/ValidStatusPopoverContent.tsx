import { useI18n } from '@amoutonbrady/solid-i18n';

import ValidIndicator from '../../icons/ValidIndicator';
import './ValidStatusPopoverContent.scss';

const ValidStatusPopoverContent = () => {
  const [t] = useI18n();

  return (
    <div class="valid-status-popover-content">
      <header class="valid-status-popover-content__header">
        <ValidIndicator />
        <h6 class="valid-status-popover-content__header__title">{t('workflowValidTitle')}</h6>
      </header>
      <section class="valid-status-popover-content__body">
        <p class="valid-status-popover-content__body__title">
          <strong>{t('workflowValidSubtitle')}</strong>
        </p>
        <p class="valid-status-popover-content__body__description">{t('workflowValidDescription')}</p>
      </section>
    </div>
  );
};

export default ValidStatusPopoverContent;
