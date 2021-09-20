import { Component, JSX, splitProps } from 'solid-js';

interface WarningIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const WarningIcon: Component<WarningIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
    </svg>
  );
};

export default WarningIcon;
