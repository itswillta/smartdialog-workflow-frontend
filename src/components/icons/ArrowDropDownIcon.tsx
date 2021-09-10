import { Component, JSX, splitProps } from 'solid-js';

interface ArrowDropDownIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const ArrowDropDownIcon: Component<ArrowDropDownIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M7 10l5 5 5-5z"></path>
    </svg>
  );
};

export default ArrowDropDownIcon;
