import { Component, createSignal, Match, Switch } from 'solid-js';

import { useStatusStore, WorkflowStatus } from '../../../store/status.store';
import ValidIndicator from '../../icons/ValidIndicator';
import InvalidIndicator from '../../icons/InvalidIndicator';
import ValidStatusPopoverContent from './ValidStatusPopoverContent';
import InvalidStatusPopoverContent from './InvalidStatusPopoverContent';
import WarningStatusPopoverContent from './WarningStatusPopoverContent';
import WarningIndicator from '../../icons/WarningIndicator';
import IconButton from '../../common/IconButton/IconButton';
import Menu from '../../common/Menu/Menu';
import './StatusIndicator.scss';

interface StatusIndicatorProps {
  storeId: string;
}

const StatusIndicator: Component<StatusIndicatorProps> = (props) => {
  let anchorEl: HTMLButtonElement;
  const [statusState] = useStatusStore();
  const [isPopoverOpen, setIsPopoverOpen] = createSignal(false);

  const handleOpenPopover = () => {
    setIsPopoverOpen(true);
  };

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  return (
    <>
      <IconButton ref={anchorEl} class="status-indicator__button" onClick={handleOpenPopover}>
        <Switch>
          <Match when={statusState.status === WorkflowStatus.VALID}>
            <ValidIndicator />
          </Match>
          <Match when={statusState.status === WorkflowStatus.INVALID}>
            <InvalidIndicator />
          </Match>
          <Match when={statusState.status === WorkflowStatus.WARNING}>
            <WarningIndicator />
          </Match>
        </Switch>
      </IconButton>
      <Menu isOpen={isPopoverOpen()} anchorEl={anchorEl} onClickAway={handleClose} placement="bottom-start">
        <Switch>
          <Match when={statusState.status === WorkflowStatus.VALID}>
            <ValidStatusPopoverContent />
          </Match>
          <Match when={statusState.status === WorkflowStatus.INVALID}>
            <InvalidStatusPopoverContent storeId={props.storeId} />
          </Match>
          <Match when={statusState.status === WorkflowStatus.WARNING}>
            <WarningStatusPopoverContent />
          </Match>
        </Switch>
      </Menu>
    </>
  );
};

export default StatusIndicator;
