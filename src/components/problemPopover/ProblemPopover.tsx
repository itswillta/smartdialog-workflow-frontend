import { useI18n } from '@amoutonbrady/solid-i18n';
import { Component, Show } from 'solid-js';

import { WorkflowStatus } from '../../store/status.store';
import CancelIcon from '../icons/CancelIcon';
import WarningIcon from '../icons/WarningIcon';
import './ProblemPopver.scss';

interface ProblemPopoverProps {
  status: WorkflowStatus;
  message: string;
}

const ProblemPopover: Component<ProblemPopoverProps> = (props) => {
  const [t] = useI18n();

  return (
    <>
      <div class="problem-popover">
        <Show when={props.status === WorkflowStatus.INVALID}>
          <CancelIcon class="problem-popover__error-icon" />
        </Show>
        <Show when={props.status === WorkflowStatus.WARNING}>
          <WarningIcon class="problem-popover__warning-icon" />
        </Show>
        <span class="problem-popover__message">{t(props.message)}</span>
      </div>
      <span class="problem-popover-arrow" />
    </>
  );
};

export default ProblemPopover;
