import { Component, JSX, splitProps } from 'solid-js';

interface FlashIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const FlashIcon: Component<FlashIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M7 2v11h3v9l7-12h-4l4-8z"></path>
    </svg>
  );
};

export default FlashIcon;
