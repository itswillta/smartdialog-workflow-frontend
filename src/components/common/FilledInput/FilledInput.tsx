import { Component, mergeProps, splitProps, JSX } from 'solid-js';

import './FilledInput.scss';

interface FilledInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  class?: string;
  width?: string;
  value: string;
  placeholder?: string;
}

const FilledInput: Component<FilledInputProps> = (props) => {
  props = mergeProps({ class: '', width: 'auto', placeholder: '' }, props);
  const [local, others] = splitProps(props, ['children', 'class', 'value', 'placeholder', 'width', 'onMouseDown', 'onMouseMove'])

  const handleMouseDown: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = event => {
    event.stopPropagation();

    if (typeof props.onMouseDown === 'function') props.onMouseDown(event);
  };

  const handleMouseMove: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = event => {
    event.stopPropagation();

    if (typeof props.onMouseMove === 'function') props.onMouseMove(event);
  };

  return (
    <input
      style={{ width: props.width }}
      classList={{ 'CUI-Input': true, [props.class]: true }}
      value={props.value}
      placeholder={props.placeholder}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      {...others}
    />
  );
};

export default FilledInput;
