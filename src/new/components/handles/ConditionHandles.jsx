import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Handle, UpArrow, RightArrow, DownArrow, LeftArrow } from 'react-flowy';

export const ARROW_DISTANCE = 12 + 24 + 70;

const useStyles = makeStyles(() => ({
  upArrow: {
    left: 'calc(50% - 12px)',
    top: -76,
  },
  downArrow: {
    left: 'calc(50% - 12px)',
    bottom: -82,
  },
}));

const ConditionHandles = React.memo(
  ({
    node,
    additionalEdgeProps = { type: 'conditionEdge' },
    shouldShowHandles,
    TopHandleIndicator = React.Fragment,
    RightHandleIndicator = React.Fragment,
    BottomHandleIndicator = React.Fragment,
    LeftHandleIndicator = React.Fragment,
    storeId,
  }) => {
    const classes = useStyles();
    const className = clsx(
      'react-flowy__standard-handles__arrow',
      !shouldShowHandles ? 'react-flowy__standard-handles__arrow--hidden' : '',
    );

    return (
      <>
        <Handle
          node={node}
          shouldShowHandle={shouldShowHandles}
          additionalEdgeProps={additionalEdgeProps}
          storeId={storeId}
        >
          <div className={clsx(className, classes.upArrow)}>
            <TopHandleIndicator>
              <UpArrow />
            </TopHandleIndicator>
          </div>
        </Handle>
        <Handle
          node={node}
          shouldShowHandle={shouldShowHandles}
          additionalEdgeProps={additionalEdgeProps}
          storeId={storeId}
        >
          <div
            className={clsx(
              className,
              'react-flowy__standard-handles__arrow--right',
            )}
          >
            <RightHandleIndicator>
              <RightArrow />
            </RightHandleIndicator>
          </div>
        </Handle>
        <Handle
          node={node}
          shouldShowHandle={shouldShowHandles}
          additionalEdgeProps={additionalEdgeProps}
          storeId={storeId}
        >
          <div className={clsx(className, classes.downArrow)}>
            <BottomHandleIndicator>
              <DownArrow />
            </BottomHandleIndicator>
          </div>
        </Handle>
        <Handle
          node={node}
          shouldShowHandle={shouldShowHandles}
          additionalEdgeProps={additionalEdgeProps}
          storeId={storeId}
        >
          <div
            className={clsx(
              className,
              'react-flowy__standard-handles__arrow--left',
            )}
          >
            <LeftHandleIndicator>
              <LeftArrow />
            </LeftHandleIndicator>
          </div>
        </Handle>
      </>
    );
  },
);

export default ConditionHandles;
