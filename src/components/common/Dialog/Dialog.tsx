import { Component, JSX, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import ClickAwayListener from '../ClickAwayListener/ClickAwayListener';
import './Dialog.scss';

interface DialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

const Dialog: Component<DialogProps> = (props) => {
  // props = mergeProps({ variant: 'contained' }, props);
  const [local, others] = splitProps(props, ['children', 'class', 'onClose', 'isOpen']);

  const handleClickAway = () => {
    props.onClose();
  }

  return (
    <Show when={props.isOpen}>
      <Portal>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div classList={{ 'CUI-Dialog': true, [props.class]: true }} {...others}>
            <div class="CUI-Dialog__container">{props.children}</div>
          </div>
        </ClickAwayListener>
      </Portal>
    </Show>
  );
};

export default Dialog;
