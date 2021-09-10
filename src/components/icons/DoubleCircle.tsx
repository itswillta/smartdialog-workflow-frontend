import { Component, JSX, splitProps } from 'solid-js';

interface DoubleCircleIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const DoubleCircleIcon: Component<DoubleCircleIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg
      classList={{ 'svg-icon': true, [props.class]: true }}
      viewBox="0 0 24 24"
      aria-hidden="true"
      title="Delete"
      {...others}
    >
      <g>
        <circle cx="12" cy="12" r="10" fill="transparent" stroke="currentColor" stroke-width="2" />
        <circle cx="12" cy="12" r="7" />
      </g>
    </svg>
  );
};

export default DoubleCircleIcon;
