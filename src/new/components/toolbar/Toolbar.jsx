import React, { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {
  transformSelector,
  useReactFlowyStoreById,
  initializeUndoRedo,
  useUndoRedoStore,
  minZoomSelector,
  maxZoomSelector,
} from 'react-flowy';

import { useTranslation } from '../../../../../i18n';
import StatusIndicator from './StatusIndicator/StatusIndicator';
import ExportAsPNG from './ExportAsPNG/ExportAsPNG';
import ScriptGenerator from './ScriptGenerator/ScriptGenerator';
import SaveStatus from './SaveStatus/SaveStatus';
import FocusCenter from './FocusCenter/FocusCenter';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 100,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 4,
  },
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
  mLSmall: {
    marginLeft: theme.spacing(1.5),
  },
  mRSmall: {
    marginRight: theme.spacing(1.5),
  },
  separator: {
    display: 'inline-block',
    width: 0,
    height: 24,
    borderRight: '1px solid rgba(0, 0, 0, 60%)',
  },
  zoomInput: {
    textAlign: 'center',
    margin: theme.spacing(0, 0.5),
    color: 'var(--black)',
    border: 'none',
    background: '#f1f3f4',
    borderRadius: 2,
    padding: theme.spacing(1, 1.5),
    outline: 'none',
    fontSize: 14,
    fontWeight: 500,
    width: 60,
  },
}));

function getFullscreenElement() {
  return (
    document.fullscreenElement || // Standard property
    document.webkitFullscreenElement || // Safari/Opera support
    document.mozFullscreenElement // Firefox support
  );
}

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );

  const toggleFullscreen = fullscreen => {
    if (fullscreen) {
      document.documentElement.requestFullscreen();
      return;
    }

    document.exitFullscreen();
  };

  useEffect(() => {
    const fullscreenChangeListener = () => {
      if (getFullscreenElement()) {
        setIsFullscreen(true);

        return;
      }

      setIsFullscreen(false);
    };

    document.addEventListener('fullscreenchange', fullscreenChangeListener);

    return () =>
      document.removeEventListener(
        'fullscreenchange',
        fullscreenChangeListener,
      );
  }, []);

  useEffect(
    () => {
      const pressF11Listener = event => {
        if (event.key !== 'F11') return;

        event.preventDefault();

        if (isFullscreen) {
          toggleFullscreen(false);

          return;
        }

        toggleFullscreen(true);
      };

      document.addEventListener('keydown', pressF11Listener);

      return () => document.removeEventListener('keydown', pressF11Listener);
    },
    [isFullscreen],
  );

  return { isFullscreen, toggleFullscreen };
};

const getZoomInputValueFromScale = scale => `${Math.round(scale * 100)}%`;

const getScaleFromZoomInputValue = zoomInputValue =>
  +zoomInputValue.replace('%', '') / 100;

let zoomInputTimeout;

const Toolbar = ({
  handleClose,
  handleUpdateWorkflow,
  workflowBasicData,
  workflowId,
  fetchWorkflow,
  agentId,
  storeId,
}) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const minZoom = useReactFlowyStore(minZoomSelector);
  const maxZoom = useReactFlowyStore(maxZoomSelector);
  const transform = useReactFlowyStore(transformSelector);
  const zoomTo = useReactFlowyStore(state => state.zoomTo);
  const undoFn = useRef();
  const redoFn = useRef();
  const undoRedoInstanceRef = useRef();
  const isUndoable = useUndoRedoStore(state => state.isUndoable);
  const isRedoable = useUndoRedoStore(state => state.isRedoable);
  const [zoomInputValue, setZoomInputValue] = useState(
    getZoomInputValueFromScale(transform[2]),
  );
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { t } = useTranslation('dialog');

  useEffect(() => {
    const { undo, redo, undoRedoInstance } = initializeUndoRedo(storeId);

    undoFn.current = undo;
    redoFn.current = redo;
    undoRedoInstanceRef.current = undoRedoInstance;
  }, []);

  useEffect(
    () => {
      setZoomInputValue(getZoomInputValueFromScale(transform[2]));
    },
    [transform[2]],
  );

  useEffect(
    () => {
      if (zoomInputTimeout) clearTimeout(zoomInputTimeout);

      zoomInputTimeout = setTimeout(() => {
        if (zoomInputValue === getZoomInputValueFromScale(transform[2])) return;

        let scale = getScaleFromZoomInputValue(zoomInputValue);

        if (scale < minZoom) {
          scale = minZoom;
        } else if (scale > maxZoom) {
          scale = maxZoom;
        }

        zoomTo(scale);

        setZoomInputValue(getZoomInputValueFromScale(scale));
      }, 500);
    },
    [zoomInputValue],
  );

  const handleUndo = useCallback(() => {
    if (typeof undoFn.current !== 'function') return;

    undoFn.current();
  }, []);

  const handleRedo = useCallback(() => {
    if (typeof redoFn.current !== 'function') return;

    redoFn.current();
  }, []);

  const handleZoomIn = () => {
    const zoom = Math.min(maxZoom, transform[2] + 0.04);

    if (transform[2] < maxZoom) zoomTo(zoom);
  };

  const handleZoomOut = () => {
    const zoom = Math.max(minZoom, transform[2] - 0.04);

    if (transform[2] > minZoom) zoomTo(zoom);
  };

  const handleZoomInputChange = event => {
    if (
      event.target.value.includes('%') &&
      event.target.value[event.target.value.length - 1] !== '%'
    )
      return;

    /* eslint-disable no-restricted-globals */
    if (isNaN(+event.target.value.replace('%', ''))) return;

    setZoomInputValue(event.target.value);
  };

  const handleEnterFullscreen = () => {
    toggleFullscreen(true);
  };

  const handleExitFullscreen = () => {
    toggleFullscreen(false);
  };

  return (
    <Paper className={classes.root} elevation={4}>
      <Tooltip title={t('undo')}>
        <IconButton
          className={clsx(classes.iconButton, classes.mR)}
          onClick={handleUndo}
          disabled={!isUndoable}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('redo')}>
        <IconButton
          className={clsx(classes.iconButton, classes.mR)}
          onClick={handleRedo}
          disabled={!isRedoable}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('zoomOut')}>
        <IconButton
          className={classes.iconButton}
          onClick={handleZoomOut}
          disabled={transform[2] === minZoom}
        >
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <input
        className={classes.zoomInput}
        value={zoomInputValue}
        onChange={handleZoomInputChange}
      />
      <Tooltip title={t('zoomIn')}>
        <IconButton
          className={clsx(classes.iconButton, classes.mR)}
          onClick={handleZoomIn}
          disabled={transform[2] === maxZoom}
        >
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <FocusCenter storeId={storeId} />
      <ExportAsPNG storeId={storeId} />
      <ScriptGenerator
        handleClose={handleClose}
        handleUpdateWorkflow={handleUpdateWorkflow}
        workflowBasicData={workflowBasicData}
        workflowId={workflowId}
        fetchWorkflow={fetchWorkflow}
        agentId={agentId}
        storeId={storeId}
      />
      {isFullscreen ? (
        <Tooltip title={t('exitFullscreen')}>
          <IconButton
            className={classes.iconButton}
            onClick={handleExitFullscreen}
          >
            <FullscreenExitIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t('enterFullscreen')}>
          <IconButton
            className={classes.iconButton}
            onClick={handleEnterFullscreen}
          >
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
      )}
      <div
        className={clsx(classes.separator, classes.mLSmall, classes.mRSmall)}
      />
      <StatusIndicator storeId={storeId} />
      <SaveStatus />
    </Paper>
  );
};

export default Toolbar;
