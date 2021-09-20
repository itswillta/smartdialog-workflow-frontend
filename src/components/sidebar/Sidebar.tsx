import CircleIcon from '../icons/Circle';
import DoubleCircleIcon from '../icons/DoubleCircle';
import EmptyCircleIcon from '../icons/EmptyCircle';
import DraggableBlock from './DraggableBlock';
import StartNodeShell from '../nodes/StartNode/StartNodeShell';
import IntentNodeShell from '../nodes/IntentNode/IntentNodeShell/IntentNodeShell';
import ConditionNodeShell from '../nodes/ConditionNode/ConditionNodeShell/ConditionNodeShell';
import ActionNodeShell from '../nodes/ActionNode/ActionNodeShell/ActionNodeShell';
import LocalTerminateNodeShell from '../nodes/LocalTerminateNode/LocalTerminateNodeShell';
import GlobalTerminateNodeShell from '../nodes/GlobalTerminateNode/GlobalTerminateNodeShell';
import SubWorkflowNodeShell from '../nodes/SubWorkflowNode/SubWorkflowNodeShell/SubWorkflowNodeShell';
import InputIcon from '../icons/InputIcon';
import FilterAltIcon from '../icons/FilterAltIcon';
import FlashIcon from '../icons/FlashIcon';
import { Component, createSignal, For, Show } from 'solid-js';
import IconButton from '../common/IconButton/IconButton';
import ForumIcon from '../icons/ForumIcon';
import MenuIcon from '../icons/MenuIcon';
import HelpIcon from '../icons/HelpIcon';
import Button from '../common/Button/Button';
import ExitToAppIcon from '../icons/ExitToAppIcon';
import Tooltip from '../common/Tooltip/Tooltip';
import './Sidebar.scss';

const draggableMainBlocks = [
  {
    name: 'start',
    description: 'startNodeDescription',
    nodeType: 'startNode',
    Icon: CircleIcon,
    DragShell: StartNodeShell,
  },
  {
    name: 'intent',
    description: 'intentNodeDescription',
    nodeType: 'intentNode',
    Icon: InputIcon,
    DragShell: IntentNodeShell,
  },
  {
    name: 'condition',
    description: 'conditionNodeDescription',
    nodeType: 'conditionNode',
    Icon: FilterAltIcon,
    DragShell: ConditionNodeShell,
  },
  {
    name: 'action',
    description: 'actionNodeDescription',
    nodeType: 'actionNode',
    Icon: FlashIcon,
    DragShell: ActionNodeShell,
  },
  {
    name: 'localTerminate',
    description: 'localTerminateNodeDescription',
    nodeType: 'localTerminateNode',
    Icon: EmptyCircleIcon,
    DragShell: LocalTerminateNodeShell,
  },
  {
    name: 'globalTerminate',
    description: 'globalTerminateNodeDescription',
    nodeType: 'globalTerminateNode',
    Icon: DoubleCircleIcon,
    DragShell: GlobalTerminateNodeShell,
  },
];

const draggableOtherBlocks = [
  {
    name: 'Sub Workflow',
    description: 'A sub workflow (or a child workflow)',
    nodeType: 'subWorkflowNode',
    Icon: ForumIcon,
    DragShell: SubWorkflowNodeShell,
  },
];

interface SidebarProps {
  exitApp: () => void;
  storeId: string;
}

const Sidebar: Component<SidebarProps> = (props) => {
  const [isMinimized, setIsMinimized] = createSignal(true);

  const toggleMinimized = () => {
    setIsMinimized((iM) => !iM);
  };

  return (
    <div classList={{ 'sidebar-drawer': true, 'sidebar-drawer--minimized': !!isMinimized() }}>
      <Show when={!isMinimized()}>
        <img
          src="/static/img/workflow-logo.png"
          width="193"
          height="auto"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          alt="Workflow Logo"
        />
      </Show>
      <IconButton
        classList={{
          'sidebar-drawer__minimize-button': true,
          'sidebar-drawer__minimize-button--minimized': !!isMinimized(),
        }}
        onClick={toggleMinimized}
      >
        <MenuIcon />
      </IconButton>
      <Show when={!isMinimized()}>
        <h5 class="sidebar-drawer__main-block-title">Main blocks</h5>
      </Show>
      <section
        classList={{
          'sidebar-drawer__draggable-main-blocks': true,
          'sidebar-drawer__draggable-main-blocks--minimized': !!isMinimized(),
        }}
      >
        <For each={draggableMainBlocks}>
          {(draggableMainBlock) => (
            <DraggableBlock
              Icon={draggableMainBlock.Icon}
              DragShell={draggableMainBlock.DragShell}
              name={draggableMainBlock.name}
              description={draggableMainBlock.description}
              nodeType={draggableMainBlock.nodeType}
              storeId={props.storeId}
              isMinimized={isMinimized()}
            />
          )}
        </For>
      </section>
      <Show when={!isMinimized()}>
        <h5 class="sidebar-drawer__other-block-title">Others</h5>
      </Show>
      <section
        classList={{
          'sidebar-drawer__draggable-other-blocks': true,
          'sidebar-drawer__draggable-other-blocks--minimized': !!isMinimized(),
        }}
      >
        <For each={draggableOtherBlocks}>
          {(draggableOtherBlock) => (
            <DraggableBlock
              Icon={draggableOtherBlock.Icon}
              DragShell={draggableOtherBlock.DragShell}
              name={draggableOtherBlock.name}
              description={draggableOtherBlock.description}
              nodeType={draggableOtherBlock.nodeType}
              storeId={props.storeId}
              isMinimized={isMinimized()}
            />
          )}
        </For>
      </section>
      <footer classList={{ 'sidebar-drawer__footer': true, 'sidebar-drawer__footer--minimized': !!isMinimized() }}>
        <Show when={!isMinimized()}>
          <button class="sidebar-drawer__footer__user-guide-button" type="button">
            <HelpIcon />
            User Guide
          </button>
        </Show>
        <Show
          when={!isMinimized()}
          fallback={
            <Tooltip title="Exit" placement="right">
              <IconButton onClick={props.exitApp}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          }
        >
          <Button class="sidebar-drawer__footer__exit-button" onClick={props.exitApp}>
            <ExitToAppIcon />
            Exit
          </Button>
        </Show>
      </footer>
    </div>
  );
};

export default Sidebar;
