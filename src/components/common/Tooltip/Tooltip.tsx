import { createPopper, Placement } from '@popperjs/core';
import { Component, createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Tooltip.scss';

interface TooltipProps {
  title: string;
  placement?: Placement;
}

const Tooltip: Component<TooltipProps> = (props) => {
  props = mergeProps({ placement: 'bottom' }, props);
  const [shouldShowTooltip, setShouldShowTooltip] = createSignal(false);
  let anchorEl: HTMLDivElement;
  let tooltipEl: HTMLDivElement;

  onMount(() => {
    const popper = createPopper(anchorEl, tooltipEl, { strategy: 'fixed', placement: props.placement })

    onCleanup(() => {
      popper.destroy();
    });
  });

  const handleMouseEnter = () => {
    setShouldShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShouldShowTooltip(false);
  };

  return (
    <>
      <div ref={anchorEl} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {props.children}
      </div>
      <Portal>
        <div ref={tooltipEl} classList={{ 'CUI-Tooltip': true, 'hidden': !shouldShowTooltip() }}>{props.title}</div>
      </Portal>
    </>
  );
};

export default Tooltip;
