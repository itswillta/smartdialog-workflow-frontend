import { Component, JSX, splitProps } from 'solid-js';

interface MoreHorizIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const MoreHorizIcon: Component<MoreHorizIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    </svg>
  );
};

export default MoreHorizIcon;
