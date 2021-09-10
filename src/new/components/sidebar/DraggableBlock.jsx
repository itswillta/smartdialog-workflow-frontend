/* eslint-disable consistent-return */

import React, { useEffect, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import {
  useReactFlowyStoreById,
  eventPointToCanvasCoordinates,
  getCanvas,
  getReactFlowyElement,
  isPointInRect,
  transformSelector,
  snapPointToGrid,
  snapGridSelector,
  nodesSelector,
} from 'react-flowy';

import { useTranslation } from '../../../../../i18n';

const useStyles = makeStyles(theme => ({
  root: ({ isMinimized }) => ({
    display: 'flex',
    marginBottom: theme.spacing(3),
    justifyContent: isMinimized ? 'center' : 'unset',
    alignItems: isMinimized ? 'center' : 'unset',
    cursor: 'grabbing',
    userSelect: 'none',
  }),
  iconGroup: {
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    color: '#e9e9ef',
  },
  blockTypeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e9e9ef',
    width: 36,
    height: 36,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0,
  },
  name: {
    color: 'var(--black)',
    fontSize: 16,
    lineHeight: '18.75px',
  },
  description: {
    marginTop: theme.spacing(0.5),
    color: '#828282',
    fontSize: 14,
    lineHeight: '16px',
  },
}));

export const nodeDropValidators = {};

export const registerNodeDropValidator = nodeType => nodeDropValidator => {
  nodeDropValidators[nodeType] = nodeDropValidator;
};

const DraggableBlock = ({
  Icon,
  DragShell,
  name,
  description,
  nodeType,
  storeId,
  isMinimized,
}) => {
  const classes = useStyles({ isMinimized });
  const { enqueueSnackbar } = useSnackbar();
  const nodes = useRef([]);
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const transform = useReactFlowyStore(transformSelector);
  const snapGrid = useReactFlowyStore(snapGridSelector);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const { t } = useTranslation('dialog');

  useEffect(() => {
    useReactFlowyStore.subscribe(nodesFromStore => {
      nodes.current = nodesFromStore;
    }, nodesSelector);
  }, []);

  const handleDrag = event => {
    setDragX(event.clientX);
    setDragY(event.clientY);
  };

  const handleDragStop = event => {
    setIsGrabbing(false);

    const reactFlowyElement = getReactFlowyElement();
    const reactFlowyElementBoundingRect = reactFlowyElement.getBoundingClientRect();
    const cursorPosition = { x: event.clientX, y: event.clientY };

    if (!isPointInRect(cursorPosition, reactFlowyElementBoundingRect)) return;

    const canvas = getCanvas(transform);

    const cursorCoordinates = snapPointToGrid(
      eventPointToCanvasCoordinates(event)(canvas),
      snapGrid,
    );

    const newNode = {
      id: `x${cursorPosition.x}y${cursorPosition.y}`,
      type: nodeType,
      position: cursorCoordinates,
      shapeType: 'rectangle',
    };

    if (nodeType === 'actionNode') {
      newNode.data = { action: '' };
    } else if (nodeType === 'intentNode') {
      newNode.data = { intent: '' };
    } else if (nodeType === 'conditionNode') {
      newNode.data = {
        conditions: [{ parameter: '', operator: '', value: '' }],
      };
      newNode.shapeType = 'hexagon';
      newNode.shapeData = { topPeakHeight: 39, bottomPeakHeight: 39 };
    } else if (
      nodeType === 'startNode' ||
      nodeType === 'localTerminateNode' ||
      nodeType === 'globalTerminateNode'
    ) {
      newNode.shapeType = 'circle';
    } else if (nodeType === 'subWorkflowNode') {
      newNode.data = { workflow: '' };
    }

    if (
      typeof nodeDropValidators[nodeType] === 'function' &&
      !nodeDropValidators[nodeType](nodes.current, newNode)
    ) {
      enqueueSnackbar(t('insertNodeFailureMessage'), { variant: 'error' });

      return;
    }

    upsertNode(newNode);
  };

  const handleDragStart = event => {
    setIsGrabbing(true);
    setDragX(event.clientX);
    setDragY(event.clientY);
  };

  useEffect(
    () => {
      if (!isGrabbing) return;

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragStop);
      document.body.style.cursor = 'grabbing';

      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragStop);
        document.body.style.cursor = 'auto';
      };
    },
    [isGrabbing, transform],
  );

  return (
    <div className={classes.root} onMouseDown={handleDragStart}>
      <span className={classes.iconGroup}>
        {!isMinimized ? (
          <>
            <DragIndicatorIcon />
            <span className={classes.blockTypeIcon}>
              <Icon />
            </span>
          </>
        ) : (
          <Tooltip title={t(name)}>
            <span className={classes.blockTypeIcon}>
              <Icon />
            </span>
          </Tooltip>
        )}
      </span>
      {!isMinimized && (
        <div className={classes.textContainer}>
          <Typography className={classes.name} variant="h6" align="left">
            {t(name)}
          </Typography>
          <Typography
            className={classes.description}
            variant="body2"
            align="left"
          >
            {t(description)}
          </Typography>
        </div>
      )}
      {isGrabbing && (
        <div
          style={{
            position: 'fixed',
            top: dragY,
            left: dragX,
            opacity: 0.7,
            transform: `scale(${transform[2]})`,
            transformOrigin: 'top left',
          }}
        >
          <DragShell />
        </div>
      )}
    </div>
  );
};

export default React.memo(DraggableBlock);
