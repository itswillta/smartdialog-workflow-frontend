import { Component, JSX, splitProps } from 'solid-js';

import './MenuItem.scss';

interface MenuItemProps extends JSX.HTMLAttributes<HTMLLIElement> {}

const MenuItem: Component<MenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return <li classList={{ 'CUI-MenuItem': true, [props.class]: true }} {...others}>{props.children}</li>;
};

export default MenuItem;
