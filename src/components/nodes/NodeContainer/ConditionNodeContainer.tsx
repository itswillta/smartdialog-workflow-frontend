import { Component, createMemo, createSignal } from 'solid-js';
import { NodeContainer, Edge, Node, useSolidFlowyStoreById } from 'solid-flowy/lib';

import ConditionHandles, { ARROW_DISTANCE } from '../../handles/ConditionHandles';
import Menu from '../../common/Menu/Menu';
import MenuItem from '../../common/Menu/MenuItem';

interface ConditionNodeContainerProps {
  node: Node;
  additionalEdgeProps?: Partial<Edge>;
  isHandleDisabled?: boolean;
  storeId: string;
}

const ConditionNodeContainer: Component<ConditionNodeContainerProps> = (props) => {
  const edgeProps = createMemo(() => ({
    arrowHeadType: 'thinarrow',
    type: 'conditionEdge',
    ...props.additionalEdgeProps,
  }));
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
          additionalEdgeProps={edgeProps()}
          isHandleDisabled={props.isHandleDisabled}
          arrowDistance={ARROW_DISTANCE}
          handles={ConditionHandles}
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

export default ConditionNodeContainer;
