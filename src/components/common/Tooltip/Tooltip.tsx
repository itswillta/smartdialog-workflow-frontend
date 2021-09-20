import { createPopper, Placement } from '@popperjs/core';
import { Component, createSignal, mergeProps, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Tooltip.scss';

interface TooltipProps {
  title: string;
  placement?: 'up' | 'right' | 'down' | 'left';
}

const Tooltip: Component<TooltipProps> = (props) => {
  props = mergeProps({ placement: 'down' }, props);
  const [shouldShowTooltip, setShouldShowTooltip] = createSignal(false);
  let anchorEl: HTMLDivElement;
  let tooltipEl: HTMLDivElement;

  const handleMouseEnter = () => {
    setShouldShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShouldShowTooltip(false);
  };

  return (
    <div ref={anchorEl} aria-label={props.title} data-balloon-pos={props.placement} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {props.children}
    </div>
  );
};

export default Tooltip;
