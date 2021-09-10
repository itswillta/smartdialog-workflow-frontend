import { Component, JSX, splitProps } from 'solid-js';

interface DoneIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const DoneIcon: Component<DoneIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
    </svg>
  );
};

export default DoneIcon;
