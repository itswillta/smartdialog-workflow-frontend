import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  useReactFlowyStoreById,
  getSourceAndTargetNodes,
  connectShapes,
  getRectangleFromNode,
} from 'react-flowy';

import { useTranslation } from '../../../../../i18n';

const EdgeWithContextMenu = React.memo(({ edgeProps, EdgeComponent }) => {
  const useReactFlowyStore = useReactFlowyStoreById(edgeProps.storeId);
  const setSelectedElementById = useReactFlowyStore(
    state => state.setSelectedElementById,
  );
  const deleteElementById = useReactFlowyStore(
    state => state.deleteElementById,
  );
  const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const { t } = useTranslation('dialog');

  const handleContextMenu = event => {
    event.preventDefault();

    setSelectedElementById(edgeProps.edge.id);

    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const handleResetWaypoints = () => {
    handleClose();

    const { sourceNode, targetNode } = getSourceAndTargetNodes(edgeProps.edge);

    const sourceRectangle = getRectangleFromNode(sourceNode);
    const targetRectangle = getRectangleFromNode(targetNode);

    const resetEdgeWaypoints = connectShapes(
      sourceRectangle,
      targetRectangle,
      'rectangle',
      'rectangle',
    );

    upsertEdge({ ...edgeProps.edge, waypoints: resetEdgeWaypoints });
  };

  const handleDelete = () => {
    handleClose();

    deleteElementById(edgeProps.edge.id);
  };

  return (
    <>
      <g onContextMenu={handleContextMenu}>
        <EdgeComponent {...edgeProps} />
      </g>
      <Menu
        open={!!mouseX && !!mouseY}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          !!mouseX && !!mouseY ? { top: mouseY, left: mouseX } : undefined
        }
      >
        <MenuItem onClick={handleResetWaypoints}>
          {t('resetWaypoints')}
        </MenuItem>
        <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
      </Menu>
    </>
  );
});

export default EdgeWithContextMenu;
