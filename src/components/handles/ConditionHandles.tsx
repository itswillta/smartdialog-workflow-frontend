import { Handle, UpArrow, RightArrow, DownArrow, LeftArrow, StandardHandlesProps } from 'solid-flowy/lib';
import { Component, createMemo, mergeProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import './ConditionHandles.scss';

export const ARROW_DISTANCE = 12 + 24 + 70;

const ConditionHandles: Component<StandardHandlesProps> = (props) => {
  props = mergeProps(
    {
      additionalEdgeProps: {
        type: 'conditionEdge',
        topHandleIndicator: 'div',
        rightHandleIndicator: 'div',
        bottomHandleIndicator: 'div',
        leftHandleIndicator: 'div',
      },
    },
    props
  );
  const defaultClassList = createMemo(() => ({
    'solid-flowy__standard-handles__arrow': true,
    'solid-flowy__standard-handles__arrow--hidden': !props.shouldShowHandles
  }));

  return (
    <Show when={props.shouldShowHandles}>
      <Handle
        node={props.node}
        shouldShowHandle={props.shouldShowHandles}
        additionalEdgeProps={props.additionalEdgeProps}
        storeId={props.storeId}
      >
        <div classList={{ 'condition-handles__up-arrow': true, ...defaultClassList() }}>
          <Dynamic component={props.topHandleIndicator}>
            <UpArrow />
          </Dynamic>
        </div>
      </Handle>
      <Handle
        node={props.node}
        shouldShowHandle={props.shouldShowHandles}
        additionalEdgeProps={props.additionalEdgeProps}
        storeId={props.storeId}
      >
        <div classList={{ 'solid-flowy__standard-handles__arrow--right': true, ...defaultClassList() }}>
          <Dynamic component={props.rightHandleIndicator}>
            <RightArrow />
          </Dynamic>
        </div>
      </Handle>
      <Handle
        node={props.node}
        shouldShowHandle={props.shouldShowHandles}
        additionalEdgeProps={props.additionalEdgeProps}
        storeId={props.storeId}
      >
        <div classList={{ 'condition-handles__down-arrow': true, ...defaultClassList() }}>
          <Dynamic component={props.bottomHandleIndicator}>
            <DownArrow />
          </Dynamic>
        </div>
      </Handle>
      <Handle
        node={props.node}
        shouldShowHandle={props.shouldShowHandles}
        additionalEdgeProps={props.additionalEdgeProps}
        storeId={props.storeId}
      >
        <div classList={{ 'solid-flowy__standard-handles__arrow--left': true, ...defaultClassList() }}>
          <Dynamic component={props.leftHandleIndicator}>
            <LeftArrow />
          </Dynamic>
        </div>
      </Handle>
    </Show>
  );
};

export default ConditionHandles;
