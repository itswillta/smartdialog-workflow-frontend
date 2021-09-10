import { Component, onCleanup, onMount } from 'solid-js';
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
};

const graphElements = [
  {
    id: '0',
    type: 'startNode',
    position: {
      x: 80,
      y: 80,
    },
    shapeType: 'circle',
  },
  {
    id: '5',
    type: 'conditionNode',
    data: {
      conditions: [{ parameter: '', operator: '', value: '' }],
    },
    position: {
      x: 400,
      y: 600,
    },
    shapeType: 'hexagon',
    shapeData: {
      topPeakHeight: 39,
      bottomPeakHeight: 39,
    },
  },
  {
    id: '1',
    type: 'intentNode',
    data: {
      intent: 'dieu_kien_vay_von',
    },
    position: {
      x: 80,
      y: 400,
    },
    shapeType: 'rectangle',
  },
  {
    id: '2',
    type: 'globalTerminateNode',
    position: {
      x: 480,
      y: 200,
    },
    shapeType: 'circle',
  },
  {
    id: '3',
    type: 'localTerminateNode',
    position: {
      x: 1120,
      y: 200,
    },
    shapeType: 'circle',
  },
  {
    id: '4',
    type: 'actionNode',
    data: {
      action: 'xac_nhan_muc_dich_cho_vay',
    },
    position: {
      x: 640,
      y: 400,
    },
    shapeType: 'rectangle',
  },
];

registerGetDockingPointFunction('hexagon')(getDockingPointForHexagon);
registerIsPointInShapeFunction('hexagon')(isPointInHexagon);
registerShapeAsTRBLFunction('hexagon')(hexagonAsTRBL);

interface WorkflowProps {
  storeId: string;
}

const Workflow: Component<WorkflowProps> = (props) => {
  const [state, { setElements, unselectAllElements, deleteElementById }] = useSolidFlowyStoreById(props.storeId);

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

    const stringifiedElements = localStorage.getItem('elements');

    if (!stringifiedElements) {
      setElements(graphElements);

      return;
    }

    const elements = JSON.parse(stringifiedElements);

    setElements(elements);
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
