import { createPopper, Instance, Placement } from '@popperjs/core';
import { Component, onCleanup, onMount, mergeProps, JSX, splitProps, Show, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';

import ClickAwayListener from '../ClickAwayListener/ClickAwayListener';
import './Popover.scss';

interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
  anchorEl: HTMLElement;
  movingAnchorElement?: HTMLElement;
  placement?: Placement;
  isOpen?: boolean;
  onClose?: () => void;
}

const Popover: Component<PopoverProps> = (props) => {
  props = mergeProps({ isOpen: false, placement: 'bottom', anchorReference: 'anchorElement' }, props);
  const [local, others] = splitProps(props, ['children', 'anchorEl', 'ref', 'isOpen', 'placement', 'onClose', 'class']);
  let menuRef: HTMLDivElement;
  let popper: Instance;

  onMount(() => {
    popper = createPopper(props.anchorEl, menuRef, { placement: props.placement, strategy: 'fixed' });

    onCleanup(() => {
      popper.destroy();
    });
  });

  createEffect(() => {
    if (props.isOpen) {
      popper.forceUpdate();
    }
  });

  const handleClickAway = () => {
    if (typeof props.onClose === 'function') props.onClose();
  };

  return (
    <Portal>
      <ClickAwayListener onClickAway={handleClickAway} additionalElements={[props.anchorEl]}>
        <div ref={menuRef} classList={{ 'CUI-Popover': true, [props.class]: true, hidden: !props.isOpen }} {...others}>
          {props.children}
        </div>
      </ClickAwayListener>
    </Portal>
  );
};

export default Popover;
