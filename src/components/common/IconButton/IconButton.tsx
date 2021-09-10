import { Component, JSX, splitProps } from "solid-js";

import './IconButton.scss';

interface IconButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const IconButton: Component<IconButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class', 'disabled']);

  return (
    <button classList={{ 'CUI-IconButton': true, [props.class]: true, 'CUI-IconButton--disabled': !!props.disabled }} disabled={props.disabled} {...others}>
      {props.children}
    </button>
  )
};

export default IconButton;
