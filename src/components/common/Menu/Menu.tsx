import { createPopper, Placement } from '@popperjs/core';
import { Component, onCleanup, onMount, mergeProps, JSX, splitProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import ClickAwayListener from '../ClickAwayListener/ClickAwayListener';
import './Menu.scss';

interface AnchorPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface MenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  anchorReference?: 'anchorElement' | 'anchorPosition';
  anchorEl?: HTMLElement;
  anchorPosition?: AnchorPosition;
  placement?: Placement;
  isOpen?: boolean;
  onClickAway?: (event: MouseEvent) => void;
}

const Menu: Component<MenuProps> = (props) => {
  props = mergeProps({ isOpen: false, placement: 'bottom', anchorReference: 'anchorElement' }, props);
  const [local, others] = splitProps(props, [
    'children',
    'anchorEl',
    'ref',
    'isOpen',
    'placement',
    'onClickAway',
    'anchorPosition',
    'anchorReference',
    'class',
  ]);
  let menuRef: HTMLDivElement;

  onMount(() => {
    if (props.anchorReference === 'anchorPosition') return;

    const popper = createPopper(props.anchorEl, menuRef, { placement: props.placement, strategy: 'fixed' });

    onCleanup(() => {
      popper.destroy();
    });
  });

  const handleClickAway = (event: MouseEvent) => {
    if (typeof props.onClickAway === 'function') props.onClickAway(event);
  };

  return (
    <Show
      when={props.anchorReference === 'anchorPosition'}
      fallback={
        <ClickAwayListener onClickAway={handleClickAway} additionalElements={[props.anchorEl]}>
          <div ref={menuRef} classList={{ 'CUI-Menu': true, [props.class]: true, hidden: !props.isOpen }} {...others}>
            <ul class="CUI-MenuList" role="menu" tabIndex={-1}>
              {props.children}
            </ul>
          </div>
        </ClickAwayListener>
      }
    >
      <Portal>
        <ClickAwayListener onClickAway={handleClickAway} additionalElements={[props.anchorEl]}>
          <div
            ref={menuRef}
            style={{
              position: props.anchorReference === 'anchorPosition' ? 'fixed' : 'unset',
              top:
                props.anchorReference === 'anchorPosition' &&
                props.anchorPosition.top &&
                `${props.anchorPosition.top}px`,
              right:
                props.anchorReference === 'anchorPosition' &&
                props.anchorPosition.right &&
                `${props.anchorPosition.right}px`,
              bottom:
                props.anchorReference === 'anchorPosition' &&
                props.anchorPosition.bottom &&
                `${props.anchorPosition.bottom}px`,
              left:
                props.anchorReference === 'anchorPosition' &&
                props.anchorPosition.left &&
                `${props.anchorPosition.left}px`,
            }}
            classList={{ 'CUI-Menu': true, [props.class]: true, hidden: !props.isOpen }}
            {...others}
          >
            <ul class="CUI-MenuList" role="menu" tabIndex={-1}>
              {props.children}
            </ul>
          </div>
        </ClickAwayListener>
      </Portal>
    </Show>
  );
};

export default Menu;
