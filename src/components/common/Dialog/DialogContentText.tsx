import { Component, JSX, splitProps } from 'solid-js';

import './DialogContentText.scss';

interface DialogContentTextProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}

const DialogContentText: Component<DialogContentTextProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return <p classList={{ 'CUI-DialogContentText': true, [props.class]: true }} {...others}>{props.children}</p>;
};

export default DialogContentText;
