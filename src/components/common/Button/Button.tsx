import { Component, JSX, mergeProps, splitProps } from "solid-js";

import './Button.scss';

interface IconButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'text';
}

const Button: Component<IconButtonProps> = (props) => {
  props = mergeProps({ variant: 'text' }, props);
  const [local, others] = splitProps(props, ['children', 'class', 'disabled', 'variant']);

  return (
    <button classList={{ 'CUI-Button': true, [props.class]: true, 'CUI-Button--disabled': !!props.disabled, 'CUI-Button--contained': props.variant === 'contained' }} disabled={props.disabled} {...others}>
      {props.children}
    </button>
  )
};

export default Button;
