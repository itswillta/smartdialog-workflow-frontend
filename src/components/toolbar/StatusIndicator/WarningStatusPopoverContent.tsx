import { Show } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import WarningIndicator from '../../icons/WarningIndicator';
import { useStatusStore } from '../../../store/status.store';
import Button from '../../common/Button/Button';
import './WarningStatusPopoverContent.scss';

const WarningStatusPopoverContent = () => {
  const [t] = useI18n();
  const [statusState, { setShouldShowUnhandledConditions }] = useStatusStore();

  const handleShowUnhandledConditions = () => {
    setShouldShowUnhandledConditions(true);
  };

  const handleHideUnhandledConditions = () => {
    setShouldShowUnhandledConditions(false);
  };

  return (
    <div class="warning-status-popover-content">
      <header class="warning-status-popover-content__header">
        <WarningIndicator />
        <h6 class="warning-status-popover-content__header__title">{t('workflowWarningTitle')}</h6>
      </header>
      <section class="warning-status-popover-content__body">
        <p class="warning-status-popover-content__body__title">
          <strong>{t('workflowWarningSubtitle')}</strong>
        </p>
        <p class="warning-status-popover-content__body__description">{t('workflowWarningDescription')}</p>
        <Show
          when={statusState.shouldShowUnhandledConditions}
          fallback={
            <Button
              classList={{
                'warning-status-popover-content__body__show-errors-button': true,
                'warning-status-popover-content__black-button': true,
              }}
              variant="contained"
              onClick={handleShowUnhandledConditions}
            >
              {t('showWarnings')}
            </Button>
          }
        >
          <Button
            classList={{
              'warning-status-popover-content__body__show-errors-button': true,
              'warning-status-popover-content__black-button': true,
            }}
            variant="contained"
            onClick={handleHideUnhandledConditions}
          >
            {t('hideWarnings')}
          </Button>
        </Show>
      </section>
    </div>
  );
};

export default WarningStatusPopoverContent;
