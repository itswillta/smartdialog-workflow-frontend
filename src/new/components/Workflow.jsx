import React, { useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import {
  DraggableReactFlowy,
  BackgroundVariant,
  Background,
  getSelectedElement,
  getOutgoingEdges,
  useReactFlowyStoreById,
  nodesSelector,
  edgesSelector,
  registerGetDockingPointFunction,
  registerIsPointInShapeFunction,
  registerShapeAsTRBLFunction,
  addMarkerDefinition,
  getTargetNode,
} from 'react-flowy';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import LocalTerminateNode from './nodes/LocalTerminateNode/LocalTerminateNode';
import GlobalTerminateNode from './nodes/GlobalTerminateNode/GlobalTerminateNode';
import StandardEdgeWithContextMenu from './edges/StandardEdgeWithContextMenu';
import { registerNodeDropValidator } from './sidebar/DraggableBlock';
import { getDockingPointForHexagon } from '../utils/docking';
import { isPointInHexagon } from '../utils/shape';
import { hexagonAsTRBL } from '../utils/trbl';
import ConditionEdgeWithContextMenu from './edges/ConditionEdgeWithContextMenu';
import EdgeWithStartIndicatorWithContextMenu from './edges/EdgeWithStartIndicatorWithContextMenu';
import SubWorkflowNode from './nodes/SubWorkflowNode/SubWorkflowNode';
import { isNodeInInfiniteLoop, isNodeInLoop } from '../utils/nodes';
import { ensureCorrectState } from '../state/ensureCorrectState';
import {
  disableAutosave,
  enableAutosave,
  activateAutosave,
} from '../state/autosave';
import { trackStatus } from '../store/status.store';
import LoopEndEdgeWithContextMenu from './edges/LoopEndEdgeWithContextMenu';
import { useTranslation } from '../../../../i18n';

const nodeTypes = {
  startNode: StartNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  localTerminateNode: LocalTerminateNode,
  globalTerminateNode: GlobalTerminateNode,
  subWorkflowNode: SubWorkflowNode,
};

const edgeTypes = {
  standardEdge: StandardEdgeWithContextMenu,
  conditionEdge: ConditionEdgeWithContextMenu,
  edgeWithStartIndicator: EdgeWithStartIndicatorWithContextMenu,
  loopEndEdge: LoopEndEdgeWithContextMenu,
};

registerGetDockingPointFunction('hexagon')(getDockingPointForHexagon);
registerIsPointInShapeFunction('hexagon')(isPointInHexagon);
registerShapeAsTRBLFunction('hexagon')(hexagonAsTRBL);

const Workflow = ({ initialElements, storeId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('dialog');
  const nodes = useRef([]);
  const edges = useRef([]);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const unselectAllElements = useReactFlowyStore(
    state => state.unselectAllElements,
  );
  const deleteElementById = useReactFlowyStore(
    state => state.deleteElementById,
  );
  const registerNodeValidator = useReactFlowyStore(
    state => state.registerNodeValidator,
  );
  const setElements = useReactFlowyStore(state => state.setElements);

  useEffect(() => {
    useReactFlowyStore.subscribe(edgesFromStore => {
      edges.current = edgesFromStore;
    }, edgesSelector);

    useReactFlowyStore.subscribe(nodesFromStore => {
      nodes.current = nodesFromStore;
    }, nodesSelector);
  }, []);

  const handleKeyUp = e => {
    if (e.key === 'Escape') {
      unselectAllElements();

      return;
    }

    if (e.key === 'Delete') {
      const selectedElement = getSelectedElement([
        ...nodes.current,
        ...edges.current,
      ]);

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  };

  useEffect(() => {
    ensureCorrectState(storeId);
    activateAutosave(storeId);
    enableAutosave(storeId);
    trackStatus(storeId);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      disableAutosave(storeId);
    };
  }, []);

  const handleLoad = () => {
    addMarkerDefinition(
      'react-flowy__thinarrow',
      <polyline
        className="react-flowy__thinarrow"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    addMarkerDefinition(
      'react-flowy__thinarrow--loop-end',
      <polyline
        className="react-flowy__thinarrow--loop-end"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    addMarkerDefinition(
      'react-flowy__thinarrow--error',
      <polyline
        className="react-flowy__thinarrow--error"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        points="-10,-4 0,0 -10,4 -10,-4"
      />,
    );

    if (Array.isArray(initialElements)) {
      const modifiedInitialElements = initialElements.map(element => {
        if (
          element.type &&
          element.type === 'conditionNode' &&
          element.shapeData &&
          element.shapeData.topPeakHeight !== 39
        ) {
          return {
            ...element,
            shapeData: { topPeakHeight: 39, bottomPeakHeight: 39 },
          };
        }

        return element;
      });

      setElements(modifiedInitialElements);
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
          const outgoingEdges = getOutgoingEdges(edges.current)(sourceNode);

          outgoingEdges.forEach(outgoingEdge => {
            if (outgoingEdge.isForming) return;

            const connectedNode = getTargetNode(nodes.current)(outgoingEdge);

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

        const formingEdges = edges.current.map(edge => {
          if (edge.target !== '?') return edge;

          return formingEdge;
        });

        const isInInfiniteLoop = isNodeInInfiniteLoop(
          nodes.current,
          formingEdges,
        )(nodes.current.find(node => node.type === 'startNode'));

        if (isInInfiniteLoop) {
          enqueueSnackbar(t('infiniteLoopErrorMessage'), { variant: 'error' });

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

      const outgoingEdges = getOutgoingEdges(edges.current)(sourceNode);

      const isInLoop = isNodeInLoop(nodes.current, edges.current)(sourceNode);

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

        const existingOutgoingEdges = getOutgoingEdges(edges.current)(
          sourceNode,
        ).filter(edge => edge.target !== targetNode.id && edge.target !== '?');

        let isThereConnectedTerminateNode = false;
        let isThereConnectedActionNode = false;

        existingOutgoingEdges.forEach(outgoingEdge => {
          const edgeTargetNode = getTargetNode(nodes.current)(outgoingEdge);

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

        const formingEdges = edges.current.map(edge => {
          if (edge.target !== '?') return edge;

          return formingEdge;
        });

        const isInInfiniteLoop = isNodeInInfiniteLoop(
          nodes.current,
          formingEdges,
        )(nodes.current.find(node => node.type === 'startNode'));

        if (isInInfiniteLoop) {
          enqueueSnackbar(t('infiniteLoopErrorMessage'), { variant: 'error' });

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

      const existingOutgoingEdges = getOutgoingEdges(edges.current)(
        sourceNode,
      ).filter(edge => edge.target !== targetNode.id && edge.target !== '?');

      let isThereConnectedTerminateNode = false;

      existingOutgoingEdges.forEach(outgoingEdge => {
        const edgeTargetNode = getTargetNode(nodes.current)(outgoingEdge);

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

  const handleBackgroundClick = () => {
    unselectAllElements();
  };

  let startNode;

  if (initialElements)
    startNode = initialElements.find(element => element.type === 'startNode');

  let defaultPosition = [0, 0];

  if (startNode) {
    defaultPosition = [
      -startNode.position.x + 200,
      -startNode.position.y + 200,
    ];
  }

  return (
    <DraggableReactFlowy
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      snapToGrid
      snapGrid={[8, 8]}
      onLoad={handleLoad}
      onBackgroundClick={handleBackgroundClick}
      storeId={storeId}
      defaultPosition={defaultPosition}
    >
      <Background
        color="#aaa"
        gap={32}
        variant={BackgroundVariant.Lines}
        storeId={storeId}
      />
    </DraggableReactFlowy>
  );
};

export default Workflow;
