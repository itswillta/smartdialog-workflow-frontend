import { Component, JSX, onCleanup, onMount, splitProps } from 'solid-js';

interface ClickAwayListenerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  onClickAway: (event: MouseEvent) => void;
  additionalElements?: HTMLElement[];
}

const ClickAwayListener: Component<ClickAwayListenerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'onClickAway', 'additionalElements']);
  let divRef: HTMLDivElement;

  const handleMouseDown = (event: MouseEvent) => {
    const eventTarget = event.target as HTMLElement;

    if (divRef.contains(eventTarget) || eventTarget === divRef) return;

    if (Array.isArray(props.additionalElements) && props.additionalElements.length > 0) {
      for (const additionalElement of props.additionalElements) {
        if (additionalElement && (additionalElement.contains(eventTarget) || eventTarget === additionalElement)) return;
      }
    }

    props.onClickAway(event);
  };

  onMount(() => {
    document.addEventListener('mousedown', handleMouseDown, { capture: true });

    onCleanup(() => {
      document.removeEventListener('mousedown', handleMouseDown, { capture: true });
    });
  });

  return (
    <div ref={divRef} {...others}>
      {props.children}
    </div>
  );
};

export default ClickAwayListener;
