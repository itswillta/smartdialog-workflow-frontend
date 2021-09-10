import { Component, JSX, splitProps } from 'solid-js';

import './DialogContent.scss';

interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const DialogContent: Component<DialogContentProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return <div classList={{ 'CUI-DialogContent': true, [props.class]: true }} {...others}>{props.children}</div>;
};

export default DialogContent;
