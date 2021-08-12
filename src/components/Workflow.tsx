import { Component } from 'solid-js';
import SolidFlowy, { addMarkerDefinition, Background, BackgroundVariant, StandardEdge, useSolidFlowyStoreById } from 'solid-flowy/lib';

import StandardNode from './nodes/StandardNode/StandardNode';
import IntentNode from './nodes/IntentNode/IntentNode';
import EdgeWithStartIndicator from './edges/EdgeWithStartIndicator';

const nodeTypes = {
  standardNode: StandardNode,
  intentNode: IntentNode,
};

const edgeTypes = {
  standardEdge: StandardEdge,
  edgeWithStartIndicator: EdgeWithStartIndicator,
};

const graphElements = [
  {
    id: '0',
    type: 'standardNode',
    position: {
      x: 80,
      y: 80,
    },
    shapeType: 'rectangle',
  },
  {
    id: '1',
    type: 'standardNode',
    data: {
      intent: 'intent-0',
    },
    position: {
      x: 80,
      y: 400,
    },
    shapeType: 'rectangle',
  },
  {
    id: '2',
    type: 'standardNode',
    data: {
      conditions: [
        {
          parameterId: 'entity-0',
          parameter: '@sys.geo_district',
          operator: '!=',
          value: 'NULL',
        },
      ],
    },
    position: {
      x: 480,
      y: 200,
    },
    shapeType: 'rectangle',
  },
  {
    id: '3',
    type: 'standardNode',
    data: {
      action: 'action-0',
    },
    position: {
      x: 1120,
      y: 200,
    },
    shapeType: 'rectangle',
  },
  {
    id: '4',
    type: 'standardNode',
    position: {
      x: 640,
      y: 600,
    },
    shapeType: 'rectangle',
  },
];

interface WorkflowProps {
  storeId: string;
}

const Workflow: Component<WorkflowProps> = (props) => {
  const [state, { setElements }] = useSolidFlowyStoreById(props.storeId);

  const handleLoad = () => {
    addMarkerDefinition('solid-flowy__thinarrow',
      <polyline
        className="solid-flowy__thinarrow"
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

  return (
    <SolidFlowy
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={[8, 8]}
      onLoad={handleLoad}
      storeId={props.storeId}
    >
      <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} storeId={props.storeId} />
    </SolidFlowy>
  );
};

export default Workflow;
