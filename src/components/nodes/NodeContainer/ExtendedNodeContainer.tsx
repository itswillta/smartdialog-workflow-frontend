import { Component, createSignal } from 'solid-js';
import { NodeContainer, Edge, Node, useSolidFlowyStoreById } from 'solid-flowy/lib';

import Menu from '../../common/Menu/Menu';
import MenuItem from '../../common/Menu/MenuItem';

export interface ExtendedNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  storeId: string;
}

const ExtendedNodeContainer: Component<ExtendedNodeContainerProps> = (props) => {
  const [state, { deleteElementById }] = useSolidFlowyStoreById(props.storeId);
  const [mouseX, setMouseX] = createSignal(null);
  const [mouseY, setMouseY] = createSignal(null);

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();

    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const deleteNode = () => {
    deleteElementById(props.node.id);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <NodeContainer
          node={props.node}
          additionalEdgeProps={{
            ...props.additionalEdgeProps,
            arrowHeadType: 'thinarrow',
            type: 'edgeWithStartIndicator',
          }}
          isHandleDisabled={props.isHandleDisabled}
          storeId={props.storeId}
        >
          {props.children}
        </NodeContainer>
      </div>
      <Menu
        isOpen={!!mouseX() && !!mouseY()}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={!!mouseX() && !!mouseY() ? { top: mouseY(), left: mouseX() } : undefined}
      >
        <MenuItem onClick={deleteNode}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default ExtendedNodeContainer;
