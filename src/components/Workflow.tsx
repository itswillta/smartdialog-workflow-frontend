import { Component, createEffect, onCleanup, onMount } from 'solid-js';
import {
  DraggableSolidFlowy,
  addMarkerDefinition,
  Background,
  BackgroundVariant,
  StandardEdge,
  useSolidFlowyStoreById,
  registerGetDockingPointFunction,
  registerIsPointInShapeFunction,
  registerShapeAsTRBLFunction,
  getSelectedElement,
  getOutgoingEdges,
  getTargetNode,
} from 'solid-flowy/lib';

import IntentNode from './nodes/IntentNode/IntentNode';
import EdgeWithStartIndicatorWithContextMenu from './edges/EdgeWithStartIndicatorWithContextMenu';
import ActionNode from './nodes/ActionNode/ActionNode';
import StartNode from './nodes/StartNode/StartNode';
import LocalTerminateNode from './nodes/LocalTerminateNode/LocalTerminateNode';
import GlobalTerminateNode from './nodes/GlobalTerminateNode/GlobalTerminateNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import SubWorkflowNode from './nodes/SubWorkflowNode/SubWorkflowNode';
import { hexagonAsTRBL } from '../utils/trbl';
import { isPointInHexagon } from '../utils/shape';
import { getDockingPointForHexagon } from '../utils/docking';
import { useWorkflowContext } from '../App';
import ConditionEdgeWithContextMenu from './edges/ConditionEdgeWithContextMenu';
import LoopEndEdgeWithContextMenu from './edges/LoopEndEdgeWithContextMenu';
import { ensureCorrectState } from '../state/ensureCorrectState';
import { activateAutosave, enableAutosave } from '../state/autosave';
import { trackStatus } from '../store/status.store';
import { isNodeInInfiniteLoop, isNodeInLoop } from '../utils/nodes';
import { registerNodeDropValidator } from './sidebar/DraggableBlock';

const nodeTypes = {
  intentNode: IntentNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  subWorkflowNode: SubWorkflowNode,
  startNode: StartNode,
  localTerminateNode: LocalTerminateNode,
  globalTerminateNode: GlobalTerminateNode,
};

const edgeTypes = {
  standardEdge: StandardEdge,
  edgeWithStartIndicator: EdgeWithStartIndicatorWithContextMenu,
  conditionEdge: ConditionEdgeWithContextMenu,
  loopEndEdge: LoopEndEdgeWithContextMenu,
};

registerGetDockingPointFunction('hexagon')(getDockingPointForHexagon);
registerIsPointInShapeFunction('hexagon')(isPointInHexagon);
registerShapeAsTRBLFunction('hexagon')(hexagonAsTRBL);

interface WorkflowProps {
  storeId: string;
}

const Workflow: Component<WorkflowProps> = (props) => {
  const [state, { setElements, unselectAllElements, deleteElementById, registerNodeValidator }] = useSolidFlowyStoreById(props.storeId);
  const { workflow } = useWorkflowContext();

  const handleLoad = () => {
    addMarkerDefinition(
      'solid-flowy__thinarrow',
      <polyline
        class="solid-flowy__thinarrow"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />
    );

    addMarkerDefinition(
      'solid-flowy__thinarrow--loop-end',
      <polyline
        class="solid-flowy__thinarrow--loop-end"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    addMarkerDefinition(
      'solid-flowy__thinarrow--error',
      <polyline
        class="solid-flowy__thinarrow--error"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    if (Array.isArray(workflow())) {
      setElements(workflow());
    } else {
      setElements([]);
    }

    registerNodeValidator('intentNode')(
      (sourceNode, targetNode, formingEdge) => {
        if (
          targetNode.id === sourceNode.id ||
          targetNode.type === 'localTerminateNode' ||
          targetNode.type === 'globalTerminateNode' ||
          targetNode.type === 'startNode' ||
          targetNode.type === 'intentNode'
        )
          return { isValid: false, reason: 'Invalid target node' };

        if (targetNode.type === 'actionNode') {
          let isThereConnectedActionNode = false;
          const outgoingEdges = getOutgoingEdges(props.storeId)(sourceNode);

          outgoingEdges.forEach(outgoingEdge => {
            if (outgoingEdge.isForming) return;

            const connectedNode = getTargetNode(props.storeId)(outgoingEdge);

            if (connectedNode.type !== 'actionNode') return;

            isThereConnectedActionNode = true;
          });

          if (isThereConnectedActionNode) {
            return {
              isValid: false,
              reason: 'Cannot connect to many action nodes',
            };
          }
        }

        const isInInfiniteLoop = isNodeInInfiniteLoop(props.storeId, formingEdge)(sourceNode);

        if (isInInfiniteLoop) {
          return { isValid: false, reason: 'An infinite loop is not allowed' };
        }

        return { isValid: true };
      },
    );

    registerNodeValidator('conditionNode')((sourceNode, targetNode) => {
      if (
        targetNode.id === sourceNode.id ||
        targetNode.type === 'localTerminateNode' ||
        targetNode.type === 'globalTerminateNode' ||
        targetNode.type === 'startNode' ||
        targetNode.type === 'intentNode'
      )
        return { isValid: false, reason: 'Invalid target node' };

      const outgoingEdges = getOutgoingEdges(props.storeId)(sourceNode);

      const isInLoop = isNodeInLoop(props.storeId)(sourceNode);

      if (!isInLoop && outgoingEdges.length > 2) {
        return {
          isValid: false,
          reason: 'A condition node can only have two outgoing edges',
        };
      }

      if (isInLoop && outgoingEdges.length > 3) {
        return {
          isValid: false,
          reason:
            'A condition node in a loop can only have three outgoing edges',
        };
      }

      return { isValid: true };
    });

    registerNodeValidator('actionNode')(
      (sourceNode, targetNode, formingEdge) => {
        if (targetNode.id === sourceNode.id || targetNode.type === 'startNode')
          return { isValid: false, reason: 'Invalid target node' };

        const existingOutgoingEdges = getOutgoingEdges(props.storeId)(
          sourceNode,
        ).filter(edge => edge.target !== targetNode.id && edge.target !== '?');

        let isThereConnectedTerminateNode = false;
        let isThereConnectedActionNode = false;

        existingOutgoingEdges.forEach(outgoingEdge => {
          const edgeTargetNode = getTargetNode(props.storeId)(outgoingEdge);

          if (
            edgeTargetNode.type === 'localTerminateNode' ||
            edgeTargetNode.type === 'globalTerminateNode'
          ) {
            isThereConnectedTerminateNode = true;
          }

          if (edgeTargetNode.type === 'actionNode') {
            isThereConnectedActionNode = true;
          }
        });

        if (isThereConnectedActionNode && targetNode.type === 'actionNode') {
          return {
            isValid: false,
            reason: 'Cannot connect to many action nodes',
          };
        }

        if (
          isThereConnectedTerminateNode &&
          (targetNode.type === 'localTerminateNode' ||
            targetNode.type === 'globalTerminateNode')
        ) {
          return {
            isValid: false,
            reason: 'There is already a connected terminate node',
          };
        }

        const isInInfiniteLoop = isNodeInInfiniteLoop(props.storeId, formingEdge)(sourceNode);

        if (isInInfiniteLoop) {
          return { isValid: false, reason: 'An infinite loop is not allowed' };
        }

        return { isValid: true };
      },
    );

    registerNodeValidator('startNode')((sourceNode, targetNode) => {
      if (
        targetNode.id === sourceNode.id ||
        targetNode.type === 'localTerminateNode' ||
        targetNode.type === 'globalTerminateNode' ||
        targetNode.type === 'conditionNode' ||
        targetNode.type === 'actionNode'
      )
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('subWorkflowNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      const existingOutgoingEdges = getOutgoingEdges(props.storeId)(
        sourceNode,
      ).filter(edge => edge.target !== targetNode.id && edge.target !== '?');

      let isThereConnectedTerminateNode = false;

      existingOutgoingEdges.forEach(outgoingEdge => {
        const edgeTargetNode = getTargetNode(props.storeId)(outgoingEdge);

        if (
          edgeTargetNode.type === 'localTerminateNode' ||
          edgeTargetNode.type === 'globalTerminateNode'
        ) {
          isThereConnectedTerminateNode = true;
        }
      });

      if (
        isThereConnectedTerminateNode &&
        (targetNode.type === 'localTerminateNode' ||
          targetNode.type === 'globalTerminateNode')
      ) {
        return {
          isValid: false,
          reason: 'There is already a connected terminate node',
        };
      }

      return { isValid: true };
    });

    registerNodeDropValidator('startNode')(allNodes => {
      if (allNodes.find(node => node.type === 'startNode')) return false;

      return true;
    });
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      unselectAllElements();

      return;
    }

    if (event.key === 'Delete') {
      const selectedElement = getSelectedElement(props.storeId);

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  };

  onMount(() => {
    ensureCorrectState(props.storeId);
    activateAutosave(props.storeId);
    enableAutosave(props.storeId);
    trackStatus(props.storeId);
    document.addEventListener('keyup', handleKeyUp);

    onCleanup(() => {
      document.removeEventListener('keyup', handleKeyUp);
    });
  })

  const handleBackgroundClick = () => {
    unselectAllElements();
  };

  return (
    <DraggableSolidFlowy
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={[8, 8]}
      onLoad={handleLoad}
      onBackgroundClick={handleBackgroundClick}
      storeId={props.storeId}
    >
      <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} storeId={props.storeId} />
    </DraggableSolidFlowy>
  );
};

export default Workflow;
