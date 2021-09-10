import {
  eventPointToCanvasCoordinates,
  getCanvas,
  isPointInShape,
  useSolidFlowyStoreById,
} from 'solid-flowy/lib';

import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ConditionNodeContainer from '../NodeContainer/ConditionNodeContainer';
import { isNodeInLoop } from '../../../utils/nodes';
import useEnsureEdgePositions from '../../../hooks/useEnsureEdgePositions';
import { NodeComponentProps } from 'solid-flowy/lib/components/Nodes/wrapNode';
import { Component, createEffect, createMemo, createSignal, Show } from 'solid-js';
import Tooltip from '../../common/Tooltip/Tooltip';
import IconButton from '../../common/IconButton/IconButton';
import MoreHorizIcon from '../../icons/MoreHorizIcon';
import Menu from '../../common/Menu/Menu';
import MenuItem from '../../common/Menu/MenuItem';
import './ConditionNode.scss';

const ConditionNode: Component<NodeComponentProps> = (props) => {
  const [state, { upsertNode, deleteElementById }] = useSolidFlowyStoreById(props.storeId);
  const outcomingEdges = createMemo(() => Object.values(state.edges).filter(edge => edge.source === props.node.id))
  const isThereOutcomingEdgeWithTrueLabel = createMemo(() => outcomingEdges().find(
    edge => !edge.isForming && edge.label === 'TRUE',
  ));
  const isThereOutcomingEdgeWithFalseLabel = createMemo(() => outcomingEdges().find(
    edge => !edge.isForming && edge.label === 'FALSE',
  ));
  const isInLoop = createMemo(() => isNodeInLoop(props.storeId)(props.node));
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  let anchorEl: HTMLButtonElement;
  useEnsureEdgePositions({ node: props.node, storeId: props.storeId });

  const handleLoopCountChange = event => {
    /* eslint-disable no-restricted-globals */
    if (isNaN(event.target.value)) return;

    if (Number(event.target.value) < 0) return;

    let loopCount;

    if (event.target.value === '0') loopCount = 1;

    if (Number(event.target.value) > 5) loopCount = 5;

    if (!loopCount) {
      loopCount = Number(event.target.value);
    }

    const newNode = { ...props.node, data: { ...props.node.data, loopCount } };

    upsertNode(newNode);
  };

  createEffect(
    () => {
      if (!isInLoop()) return;

      if (props.node.data.loopCount) return;

      const newNode = { ...props.node, data: { ...props.node.data, loopCount: 1 } };

      upsertNode(newNode);
    },
  );

  const handleDelete = () => {
    deleteElementById(props.node.id);
  };

  const handleMouseDown = (event: MouseEvent) => {
    const canvas = getCanvas(state.transform);

    const nodeShape = {
      x: props.node.position.x,
      y: props.node.position.y,
      width: props.node.width,
      height: props.node.height,
      ...props.node.shapeData,
    };

    if (
      !isPointInShape(props.node.shapeType)(
        eventPointToCanvasCoordinates(event)(canvas),
        nodeShape,
      )
    ) {
      event.stopPropagation();
    }
  };

  createEffect(
    () => {
      if (isInLoop()) return;

      const breakLoopEdge = outcomingEdges().find(
        outcomingEdge => outcomingEdge.type === 'loopEndEdge',
      );

      if (!breakLoopEdge) return;

      deleteElementById(breakLoopEdge.id);
    }
  );

  const additionalEdgeProps = createMemo(
    () => {
      let nextEdgeLabel = 'TRUE';

      if (isThereOutcomingEdgeWithTrueLabel()) {
        if (!isThereOutcomingEdgeWithFalseLabel()) {
          nextEdgeLabel = 'FALSE';
        } else if (isInLoop) {
          return {
            type: 'loopEndEdge',
            arrowHeadType: 'thinarrow--loop-end',
            label: `Loop count > ${props.node.data.loopCount}`,
          };
        }
      }

      return { label: nextEdgeLabel };
    }
  );

  const handleInputMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleInputMouseMove = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <ConditionNodeContainer
      node={props.node}
      additionalEdgeProps={additionalEdgeProps()}
      storeId={props.storeId}
    >
      <div
        classList={{
          'condition-node__container': true,
          'condition-node--selected': props.node.isSelected,
        }}
      >
        <svg
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: -39,
            left: 0,
            filter: `drop-shadow(rgba(0, 0, 0, 0.1) 0px -1px 2px)${
              props.node.isSelected ? ' drop-shadow(0px -2px 1px #3ab6f369)' : ''
            }`,
          }}
          width="366"
          height="40"
          viewBox="0 0 366 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M183 0L366 40H0 0Z" fill="#ffffff" fill-opacity="1" />
          <path d="M183 0L366 40H0 0Z" fill="#2e7d32" fill-opacity="1" />
        </svg>
        <svg
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            bottom: -39,
            left: 0,
            filter: `drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)${
              props.node.isSelected ? ' drop-shadow(0px 2px 1px #3ab6f369)' : ''
            }`,
          }}
          width="366"
          height="40"
          viewBox="0 0 366 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M183 40L0 0L366 0L183 40Z" fill="#ffffff" fill-opacity="1" />
        </svg>
        <ConditionNodeHeader />
        <ConditionNodeBody node={props.node} storeId={props.storeId} />
        <footer class='condition-node__footer'>
          <div>
            <Show when={isInLoop()}>
            <Tooltip title="Maximum loop count">
                <input
                  value={props.node.data.loopCount}
                  class='condition-node__footer-loop-count-input'
                  onChange={handleLoopCountChange}
                  onMouseDown={handleInputMouseDown}
                  onMouseMove={handleInputMouseMove}
                />
              </Tooltip>
            </Show>
          </div>
          <div>
            <IconButton
              ref={anchorEl}
              class='condition-node__foter-more-options-button'
              aria-label="more options"
              onClick={handleOpenMenu}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              isOpen={isMenuOpen()}
              onClickAway={() => setIsMenuOpen(false)}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </div>
        </footer>
      </div>
    </ConditionNodeContainer>
  );
};

export default ConditionNode;
