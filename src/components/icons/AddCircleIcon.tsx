import { Component, JSX, splitProps } from 'solid-js';

interface AddCircleIconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  class?: string;
}

const AddCircleIcon: Component<AddCircleIconProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'class']);

  return (
    <svg classList={{ 'svg-icon': true, [props.class]: true }} viewBox="0 0 24 24" aria-hidden="true" {...others}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
    </svg>
  );
};

export default AddCircleIcon;
