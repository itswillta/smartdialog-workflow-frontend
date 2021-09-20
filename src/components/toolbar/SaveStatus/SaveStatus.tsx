import { useI18n } from '@amoutonbrady/solid-i18n';

import { useWorkflowContext } from '../../../App';
import { useStatusStore, WorkflowStatus } from '../../../store/status.store';
import DoneIcon from '../../icons/DoneIcon';
import ErrorIcon from '../../icons/ErrorIcon';
import SyncIcon from '../../icons/SyncIcon';
import './SaveStatus.scss';

const SaveStatus = () => {
  const [t] = useI18n();
  const { autoSaveStatus } = useWorkflowContext();
  const [state] = useStatusStore();

  if (state.status === WorkflowStatus.INVALID || autoSaveStatus() === 'error') {
    return (
      <div class="save-status__container">
        <ErrorIcon />
        {t('notSaved')}
      </div>
    );
  }

  if (autoSaveStatus() === 'loading') {
    return (
      <div class="save-status__container">
        <SyncIcon />
        {t('saving')}
      </div>
    );
  }

  if (autoSaveStatus() === 'success' || !autoSaveStatus()) {
    return (
      <div class="save-status__container">
        <DoneIcon />
        {t('saved')}
      </div>
    );
  }

  return <div>{autoSaveStatus}</div>;
};

export default SaveStatus;
