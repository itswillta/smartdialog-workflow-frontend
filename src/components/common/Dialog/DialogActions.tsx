import { Component, JSX, splitProps } from 'solid-js';

import './DialogActions.scss';

interface DialogActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const DialogActions: Component<DialogActionsProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return <div classList={{ 'CUI-DialogActions': true, [props.class]: true }} {...others}>{props.children}</div>;
};

export default DialogActions;
