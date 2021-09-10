import { Component, JSX, splitProps } from 'solid-js';

import './DialogTitle.scss';

interface DialogTitleProps extends JSX.HTMLAttributes<HTMLDivElement> {}

const DialogTitle: Component<DialogTitleProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <div classList={{ 'CUI-DialogTitle': true, [props.class]: true }} {...others}>
      <h2 class="CUI-DialogTitle__title">{props.children}</h2>
    </div>
  );
};

export default DialogTitle;
