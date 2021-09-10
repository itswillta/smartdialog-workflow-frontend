import { Component, JSX, splitProps } from 'solid-js';

interface FullscreenIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const FullscreenIcon: Component<FullscreenIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
    </svg>
  );
};

export default FullscreenIcon;
