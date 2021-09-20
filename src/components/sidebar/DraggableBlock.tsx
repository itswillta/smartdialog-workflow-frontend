import { Component, createEffect, createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useI18n } from '@amoutonbrady/solid-i18n';
import {
  useSolidFlowyStoreById,
  eventPointToCanvasCoordinates,
  getCanvas,
  getSolidFlowyElement,
  isPointInRect,
  snapPointToGrid,
  Node,
} from 'solid-flowy/lib';

import Tooltip from '../common/Tooltip/Tooltip';
import DragIndicatorIcon from '../icons/DragIndicatorIcon';
import './DraggableBlock.scss';

export type NodeDropValidator = (nodes: Node[], newNode: Node) => boolean;

export const nodeDropValidators: Record<string, NodeDropValidator> = {};

export const registerNodeDropValidator = (nodeType: string) => (nodeDropValidator: NodeDropValidator) => {
  nodeDropValidators[nodeType] = nodeDropValidator;
};

interface DraggableBlockProps {
  Icon: Component;
  DragShell: Component;
  name: string;
  description: string;
  nodeType: string;
  storeId: string;
  isMinimized?: boolean;
}

const DraggableBlock: Component<DraggableBlockProps> = (props) => {
  const [t] = useI18n();
  const [state, { upsertNode }] = useSolidFlowyStoreById(props.storeId);
  const [isGrabbing, setIsGrabbing] = createSignal(false);
  const [dragX, setDragX] = createSignal(0);
  const [dragY, setDragY] = createSignal(0);

  const handleDrag = (event: MouseEvent) => {
    setDragX(event.clientX);
    setDragY(event.clientY);
  };

  const handleDragStop = (event: MouseEvent) => {
    setIsGrabbing(false);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragStop);
    document.body.style.cursor = 'auto';

    const reactFlowyElement = getSolidFlowyElement();
    const reactFlowyElementBoundingRect = reactFlowyElement.getBoundingClientRect();
    const cursorPosition = { x: event.clientX, y: event.clientY };

    if (!isPointInRect(cursorPosition, reactFlowyElementBoundingRect)) return;

    const canvas = getCanvas(state.transform);

    const cursorCoordinates = snapPointToGrid(eventPointToCanvasCoordinates(event)(canvas), state.snapGrid);

    const newNode: Node = {
      id: `x${cursorPosition.x}y${cursorPosition.y}`,
      type: props.nodeType,
      position: cursorCoordinates,
      shapeType: 'rectangle',
    };

    if (props.nodeType === 'actionNode') {
      newNode.data = { action: '' };
    } else if (props.nodeType === 'intentNode') {
      newNode.data = { intent: '' };
    } else if (props.nodeType === 'conditionNode') {
      newNode.data = {
        conditions: [{ parameter: '', operator: '', value: '' }],
      };
      newNode.shapeType = 'hexagon';
      newNode.shapeData = { topPeakHeight: 39, bottomPeakHeight: 39 };
    } else if (
      props.nodeType === 'startNode' ||
      props.nodeType === 'localTerminateNode' ||
      props.nodeType === 'globalTerminateNode'
    ) {
      newNode.shapeType = 'circle';
    } else if (props.nodeType === 'subWorkflowNode') {
      newNode.data = { workflow: '' };
    }

    if (
      typeof nodeDropValidators[props.nodeType] === 'function' &&
      !nodeDropValidators[props.nodeType](Object.values(state.nodes), newNode)
    ) {
      // enqueueSnackbar('Failed to insert node', { variant: 'error' });

      return;
    }

    upsertNode(newNode);
  };

  const handleDragStart = (event: MouseEvent) => {
    setIsGrabbing(true);
    setDragX(event.clientX);
    setDragY(event.clientY);

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragStop);
    document.body.style.cursor = 'grabbing';
  };

  return (
    <div classList={{ "draggable-block": true, "draggable-block--minimized": !!props.isMinimized }} onMouseDown={handleDragStart}>
      <span class="draggable-block__icon-group">
        <Show
          when={props.isMinimized}
          fallback={
            <>
              <DragIndicatorIcon />
              <span class="draggable-block__icon-group__block-type-icon">
                <Dynamic component={props.Icon} />
              </span>
            </>
          }
        >
          <Tooltip title={t(props.name)} placement="right">
            <span class="draggable-block__icon-group__block-type-icon">
              <Dynamic component={props.Icon} />
            </span>
          </Tooltip>
        </Show>
      </span>
      <Show when={!props.isMinimized}>
        <div class="draggable-block__text-container">
          <h6 class="draggable-block__text-container__name">{t(props.name)}</h6>
          <p class="draggable-block__text-container__description">{t(props.description)}</p>
        </div>
      </Show>
      <Show when={isGrabbing()}>
        <div
          style={{
            position: 'fixed',
            top: `${dragY()}px`,
            left: `${dragX()}px`,
            opacity: 0.7,
            transform: `scale(${state.transform[2]})`,
            'transform-origin': 'top left',
            'z-index': 99,
          }}
        >
          <Dynamic component={props.DragShell} />
        </div>
      </Show>
    </div>
  );
};

export default DraggableBlock;
