import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import {
  edgesSelector,
  eventPointToCanvasCoordinates,
  getCanvas,
  isPointInShape,
  nodesSelector,
  transformSelector,
  useReactFlowyStoreById,
} from 'react-flowy';

import { useTranslation } from '../../../../../../i18n';
import ConditionNodeHeader from './ConditionNodeHeader';
import ConditionNodeBody from './ConditionNodeBody';
import ConditionNodeContainer from '../NodeContainer/ConditionNodeContainer';
import ProblemPopover from '../../problemPopover/ProblemPopover';
import { useStatusStore } from '../../../store/status.store';
import { isNodeInLoop } from '../../../utils/nodes';
import useEnsureEdgePositions from '../useEnsureEdgePositions';
import DashedLoopIcon from '../../icons/DashedLoop';
import Autocomplete from '../../common/Autocomplete/Autocomplete';

const useStyles = makeStyles(theme => ({
  container: {
    boxShadow: '0px 2px 4px 1px rgb(0 0 0 / 20%)',
    borderRadius: 4,
  },
  selected: {
    boxShadow: '0px 0px 4px var(--selected-color)',
  },
  leftArrow: {
    position: 'relative',
    width: 100,
    height: 100,
    overflow: 'hidden',
    boxShadow: '0 16px 10px -17px rgba(0, 0, 0, 0.5)',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 50,
      height: 50,
      background: '#999',
      transform: 'rotate(45deg)',
      top: 75,
      left: 25,
      boxShadow: '-1px -1px 10px -2px rgba(0, 0, 0, 0.5)',
    },
  },
  footer: {
    position: 'absolute',
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(0),
  },
  footerMainContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loopContainer: {
    position: 'relative',
    width: 20,
    height: 20,
    background: '#f1f3f4',
    borderRadius: '50%',
  },
  loopIcon: {
    position: 'absolute',
    left: -2,
    top: -2,
    zIndex: 1,
    color: 'purple',
  },
  loopCountInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    border: 'none',
    zIndex: 2,
    height: 20,
    width: 20,
    borderRadius: '50%',
    background: 'transparent',
    textAlign: 'center',
  },
  conditionOperatorContainer: {
    marginLeft: theme.spacing(1),
  },
  moreOptionsButton: {
    width: 20,
    height: 20,
  },
}));

const conditionOperators = ['AND', 'OR'];

const ConditionNode = ({ node, storeId }) => {
  const classes = useStyles();
  const shouldShowInvalidNodes = useStatusStore(
    state => state.shouldShowInvalidNodes,
  );
  const shouldShowUnhandledConditions = useStatusStore(
    state => state.shouldShowUnhandledConditions,
  );
  const problematicNode = useStatusStore(state =>
    state.problematicNodes.find(pN => pN.id === node.id),
  );
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const nodes = useReactFlowyStore(nodesSelector);
  const edges = useReactFlowyStore(edgesSelector);
  const outcomingEdges = edges.filter(edge => edge.source === node.id);
  const isThereOutcomingEdgeWithTrueLabel = outcomingEdges.find(
    edge => !edge.isForming && edge.label === 'TRUE',
  );
  const isThereOutcomingEdgeWithFalseLabel = outcomingEdges.find(
    edge => !edge.isForming && edge.label === 'FALSE',
  );
  const isInLoop = useMemo(() => isNodeInLoop(nodes, edges)(node), [
    nodes,
    edges,
    node,
  ]);
  const upsertNode = useReactFlowyStore(state => state.upsertNode);
  const deleteElementById = useReactFlowyStore(
    state => state.deleteElementById,
  );
  const transform = useReactFlowyStore(transformSelector);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation('dialog');
  useEnsureEdgePositions(node, storeId);

  const handleLoopCountChange = event => {
    /* eslint-disable no-restricted-globals */
    if (isNaN(event.target.value)) return;

    if (Number(event.target.value) < 0) return;

    let loopCount;

    if (event.target.value === '0') loopCount = 1;

    if (Number(event.target.value) > 5) loopCount = 5;

    if (!loopCount) {
      loopCount = Number(event.target.value);
    }

    const newNode = { ...node, data: { ...node.data, loopCount } };

    upsertNode(newNode);
  };

  useLayoutEffect(
    () => {
      if (!isInLoop) return;

      if (node.data.loopCount) return;

      const newNode = { ...node, data: { ...node.data, loopCount: 1 } };

      upsertNode(newNode);
    },
    [isInLoop],
  );

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseMenu();

    if (node) deleteElementById(node.id);
  };

  const handleMouseDown = e => {
    const canvas = getCanvas(transform);

    const nodeShape = {
      x: node.position.x,
      y: node.position.y,
      width: node.width,
      height: node.height,
      ...node.shapeData,
    };

    if (
      !isPointInShape(node.shapeType)(
        eventPointToCanvasCoordinates(e)(canvas),
        nodeShape,
      )
    ) {
      e.stopPropagation();
    }
  };

  useEffect(
    () => {
      if (isInLoop) return;

      const breakLoopEdge = outcomingEdges.find(
        outcomingEdge => outcomingEdge.type === 'loopEndEdge',
      );

      if (!breakLoopEdge) return;

      deleteElementById(breakLoopEdge.id);
    },
    [isInLoop],
  );

  const additionalEdgeProps = useMemo(
    () => {
      let nextEdgeLabel = 'TRUE';

      if (isThereOutcomingEdgeWithTrueLabel) {
        if (!isThereOutcomingEdgeWithFalseLabel) {
          nextEdgeLabel = 'FALSE';
        } else if (isInLoop) {
          return {
            type: 'loopEndEdge',
            arrowHeadType: 'thinarrow--loop-end',
            label: `Loop count > ${node.data.loopCount}`,
          };
        }
      }

      return { label: nextEdgeLabel };
    },
    [
      isThereOutcomingEdgeWithFalseLabel,
      isThereOutcomingEdgeWithTrueLabel,
      node.data.loopCount,
    ],
  );

  const handleInputMouseDown = event => {
    event.stopPropagation();
  };

  const handleInputMouseMove = event => {
    event.stopPropagation();
  };

  const handleConditionOperatorChange = newConditionMode => {
    const newNode = {
      ...node,
      data: { ...node.data, conditionOperator: newConditionMode },
    };

    upsertNode(newNode);
  };

  return (
    <ConditionNodeContainer
      node={node}
      additionalEdgeProps={additionalEdgeProps}
      storeId={storeId}
    >
      <Paper
        className={clsx(
          classes.container,
          node.isSelected ? classes.selected : '',
        )}
        elevation={0}
      >
        <svg
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: -39,
            left: 0,
            filter: `drop-shadow(rgba(0, 0, 0, 0.1) 0px -1px 2px)${
              node.isSelected ? ' drop-shadow(0px -2px 1px #3ab6f369)' : ''
            }`,
          }}
          width="366"
          height="40"
          viewBox="0 0 366 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M183 0L366 40H0 0Z" fill="#ffffff" fillOpacity="1" />
          <path d="M183 0L366 40H0 0Z" fill="#2e7d32" fillOpacity="1" />
        </svg>
        <svg
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            bottom: -39,
            left: 0,
            filter: `drop-shadow(rgba(0, 0, 0, 0.2) 0px 4px 2px)${
              node.isSelected ? ' drop-shadow(0px 2px 1px #3ab6f369)' : ''
            }`,
          }}
          width="366"
          height="40"
          viewBox="0 0 366 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M183 40L0 0L366 0L183 40Z" fill="#ffffff" fillOpacity="1" />
        </svg>
        <ConditionNodeHeader node={node} storeId={storeId} />
        <ConditionNodeBody node={node} storeId={storeId} />
        <footer className={classes.footer}>
          <div className={classes.footerMainContainer}>
            {isInLoop && (
              <Tooltip title={t('maximumLoopCount')}>
                <div className={classes.loopContainer}>
                  <DashedLoopIcon className={classes.loopIcon} />
                  <input
                    value={node.data.loopCount}
                    className={classes.loopCountInput}
                    onChange={handleLoopCountChange}
                    onMouseDown={handleInputMouseDown}
                    onMouseMove={handleInputMouseMove}
                  />
                </div>
              </Tooltip>
            )}
            {node.data &&
              Array.isArray(node.data.conditions) &&
              node.data.conditions.length > 1 && (
                <Tooltip title={t('conditionOperator')}>
                  <div className={classes.conditionOperatorContainer}>
                    <Autocomplete
                      options={conditionOperators}
                      getOptionKey={option => option}
                      getOptionLabel={option => option}
                      value={node.data.conditionOperator}
                      onChange={handleConditionOperatorChange}
                      shouldShowFullOptions
                      fixedWidth={48}
                      isSmall
                    />
                  </div>
                </Tooltip>
              )}
          </div>
          <div>
            <IconButton
              className={classes.moreOptionsButton}
              aria-label="more options"
              onClick={handleOpenMenu}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
            </Menu>
          </div>
        </footer>
        {(shouldShowInvalidNodes || shouldShowUnhandledConditions) &&
          problematicNode && (
            <ProblemPopover
              status={problematicNode.status}
              message={problematicNode.message}
            />
          )}
      </Paper>
    </ConditionNodeContainer>
  );
};

export default React.memo(ConditionNode);
