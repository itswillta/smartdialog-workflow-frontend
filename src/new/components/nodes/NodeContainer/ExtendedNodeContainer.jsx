import React, { useState } from 'react';
import { NodeContainer, useReactFlowyStoreById } from 'react-flowy';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ExtendedNodeContainer = React.memo(
  ({ children, node, isHandleDisabled, additionalEdgeProps, storeId }) => {
    const useReactFlowyStore = useReactFlowyStoreById(storeId);
    const deleteElementById = useReactFlowyStore(
      state => state.deleteElementById,
    );
    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);

    const handleContextMenu = event => {
      event.preventDefault();

      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };

    const handleClose = () => {
      setMouseX(null);
      setMouseY(null);
    };

    const deleteNode = () => {
      deleteElementById(node.id);
    };

    return (
      <>
        <div onContextMenu={handleContextMenu}>
          <NodeContainer
            node={node}
            additionalEdgeProps={{
              ...additionalEdgeProps,
              arrowHeadType: 'thinarrow',
              type: 'edgeWithStartIndicator',
            }}
            isHandleDisabled={isHandleDisabled}
            storeId={storeId}
          >
            {children}
          </NodeContainer>
        </div>
        <Menu
          open={!!mouseX && !!mouseY}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            !!mouseX && !!mouseY ? { top: mouseY, left: mouseX } : undefined
          }
        >
          <MenuItem onClick={deleteNode}>Delete</MenuItem>
        </Menu>
      </>
    );
  },
);

export default ExtendedNodeContainer;
