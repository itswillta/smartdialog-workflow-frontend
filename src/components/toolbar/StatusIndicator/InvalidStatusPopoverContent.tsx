import { Component, Show } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';
import { useSolidFlowyStoreById } from 'solid-flowy/lib';

import InvalidIndicator from '../../icons/InvalidIndicator';
import { useStatusStore } from '../../../store/status.store';
import { autosaveFunctionObject } from '../../../state/autosave';
import { useWorkflowContext } from '../../../App';
import './InvalidStatusPopoverContent.scss';
import Button from '../../common/Button/Button';

interface InvalidStatusPopoverContentProps {
  storeId: string;
}

const InvalidStatusPopoverContent: Component<InvalidStatusPopoverContentProps> = (props) => {
  const [t] = useI18n();
  const [solidFlowyState] = useSolidFlowyStoreById(props.storeId);
  const [statusState, { setShouldShowInvalidNodes }] = useStatusStore();
  const { autoSaveStatus } = useWorkflowContext();

  const handleShowInvalidNodes = () => {
    setShouldShowInvalidNodes(true);
  };

  const handleHideInvalidNodes = () => {
    setShouldShowInvalidNodes(false);
  };

  const forceSave = () => {
    autosaveFunctionObject.handleAutosaveWorkflow([
      ...Object.values(solidFlowyState.nodes),
      ...Object.values(solidFlowyState.edges),
    ]);
  };

  return (
    <div class="invalid-status-popover-content">
      <header class="invalid-status-popover-content__header">
        <InvalidIndicator />
        <h6 class="invalid-status-popover-content__header__title">{t('workflowInvalidTitle')}</h6>
      </header>
      <section class="invalid-status-popover-content__body">
        <p class="invalid-status-popover-content__body__title">
          <strong>{t('workflowInvalidSubtitle')}</strong>
        </p>
        <p class="invalid-status-popover-content__body__description">{t('workflowInvalidDescription')}</p>
        <Show
          when={statusState.shouldShowInvalidNodes}
          fallback={
            <Button
              classList={{
                'invalid-status-popover-content__body__show-errors-button': true,
                'invalid-status-popover-content__black-button': true,
              }}
              variant="contained"
              onClick={handleShowInvalidNodes}
            >
              {t('showErrors')}
            </Button>
          }
        >
          <Button
            classList={{
              'invalid-status-popover-content__body__show-errors-button': true,
              'invalid-status-popover-content__black-button': true,
            }}
            variant="contained"
            onClick={handleHideInvalidNodes}
          >
            {t('hideErrors')}
          </Button>
        </Show>
        <Button
          class="invalid-status-popover-content__body__force-save-button"
          onClick={forceSave}
          disabled={autoSaveStatus() === 'loading'}
        >
          {autoSaveStatus() === 'loading' ? t('saving') : t('forceSave')}
        </Button>
      </section>
    </div>
  );
};

export default InvalidStatusPopoverContent;
