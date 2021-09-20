import { Component, createSignal } from 'solid-js';

import {
  useSolidFlowyStoreById,
  getSourceAndTargetNodes,
  connectShapes,
  getRectangleFromNode,
  EdgeProps,
} from 'solid-flowy/lib';
import { Dynamic } from 'solid-js/web';
import Menu from '../common/Menu/Menu';
import MenuItem from '../common/Menu/MenuItem';

interface EdgeWithContextMenuProps {
  edgeProps: EdgeProps;
  EdgeComponent: Component<EdgeProps>;
}

const EdgeWithContextMenu: Component<EdgeWithContextMenuProps> = (props) => {
  const [state, { setSelectedElementById, deleteElementById, upsertEdge }] = useSolidFlowyStoreById(props.edgeProps.storeId);
  const [mouseX, setMouseX] = createSignal(null);
  const [mouseY, setMouseY] = createSignal(null);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();

    setSelectedElementById(props.edgeProps.edge.id);

    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const handleResetWaypoints = () => {
    handleClose();

    const { sourceNode, targetNode } = getSourceAndTargetNodes(props.edgeProps.storeId)(props.edgeProps.edge);

    const sourceRectangle = getRectangleFromNode(sourceNode);
    const targetRectangle = getRectangleFromNode(targetNode);

    const resetEdgeWaypoints = connectShapes(
      sourceRectangle,
      targetRectangle,
      'rectangle',
      'rectangle',
    );

    upsertEdge({ ...props.edgeProps.edge, waypoints: resetEdgeWaypoints });
  };

  const handleDelete = () => {
    handleClose();

    deleteElementById(props.edgeProps.edge.id);
  };

  return (
    <>
      <g onContextMenu={handleContextMenu}>
        <Dynamic component={props.EdgeComponent} edge={props.edgeProps.edge} markerEndId={props.edgeProps.markerEndId} storeId={props.edgeProps.storeId} />
      </g>
      <Menu
        isOpen={!!mouseX && !!mouseY}
        anchorReference="anchorPosition"
        anchorPosition={
          !!mouseX && !!mouseY ? { top: mouseY(), left: mouseX() } : undefined
        }
        onClose={handleClose}
      >
        <MenuItem onClick={handleResetWaypoints}>
          Reset waypoints
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default EdgeWithContextMenu;
