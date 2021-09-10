import React, { useMemo, useState } from 'react';
import { NodeContainer, useReactFlowyStoreById } from 'react-flowy';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useTranslation } from '../../../../../../i18n';
import ConditionHandles, {
  ARROW_DISTANCE,
} from '../../handles/ConditionHandles';

const ConditionNodeContainer = ({
  children,
  node,
  isHandleDisabled,
  additionalEdgeProps,
  storeId,
}) => {
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const deleteElementById = useReactFlowyStore(
    state => state.deleteElementById,
  );
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const { t } = useTranslation('dialog');

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

  const edgeProps = useMemo(
    () => ({
      arrowHeadType: 'thinarrow',
      type: 'conditionEdge',
      ...additionalEdgeProps,
    }),
    [additionalEdgeProps],
  );

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <NodeContainer
          node={node}
          additionalEdgeProps={edgeProps}
          isHandleDisabled={isHandleDisabled}
          arrowDistance={ARROW_DISTANCE}
          Handles={ConditionHandles}
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
        <MenuItem onClick={deleteNode}>{t('delete')}</MenuItem>
      </Menu>
    </>
  );
};

export default React.memo(ConditionNodeContainer);
