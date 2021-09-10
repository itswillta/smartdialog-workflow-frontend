import { Component, createEffect, createSignal, onMount, JSX, Show } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';
import { useSolidFlowyStoreById, initializeUndoRedo, useUndoRedoStoreById, Elements } from 'solid-flowy/lib';
import { UndoRedo } from 'solid-flowy/lib/premade/features/undoRedo/UndoRedo';

import StatusIndicator from './StatusIndicator/StatusIndicator';
import ExportAsPNG from './ExportAsPNG/ExportAsPNG';
import ScriptGenerator from './ScriptGenerator/ScriptGenerator';
import SaveStatus from './SaveStatus/SaveStatus';
import FocusCenter from './FocusCenter/FocusCenter';
import { useFullscreen } from '../../hooks/useFullscreen';
import IconButton from '../common/IconButton/IconButton';
import Tooltip from '../common/Tooltip/Tooltip';
import FullscreenIcon from '../icons/FullscreenIcon';
import FullscreenExitIcon from '../icons/FullscreenExitIcon';
import RedoIcon from '../icons/RedoIcon';
import UndoIcon from '../icons/UndoIcon';
import ZoomOutIcon from '../icons/ZoomOutIcon';
import ZoomInIcon from '../icons/ZoomInIcon';
import './Toolbar.scss';

const getZoomInputValueFromScale = (scale: number) => `${Math.round(scale * 100)}%`;

const getScaleFromZoomInputValue = (zoomInputValue: string) => +zoomInputValue.replace('%', '') / 100;

let zoomInputTimeout: number;

interface ToolbarProps {
  handleClose: () => void;
  handleUpdateWorkflow: Function;
  workflowBasicData: Record<string, unknown>;
  workflowId: string;
  fetchWorkflow: () => Promise<void>;
  agentId: string;
  storeId: string;
}

const Toolbar: Component<ToolbarProps> = (props) => {
  const [t] = useI18n();
  const [state, { zoomTo }] = useSolidFlowyStoreById(props.storeId);
  let undoFn: Function;
  let redoFn: Function;
  let undoRedoInstanceRef: UndoRedo<Elements<any>>;
  const [undoRedoState] = useUndoRedoStoreById(props.storeId);
  const [zoomInputValue, setZoomInputValue] = createSignal(getZoomInputValueFromScale(state.transform[2]));
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  onMount(() => {
    const { undo, redo, undoRedoInstance } = initializeUndoRedo(props.storeId);

    undoFn = undo;
    redoFn = redo;
    undoRedoInstanceRef = undoRedoInstance;
  });

  createEffect(() => {
    setZoomInputValue(getZoomInputValueFromScale(state.transform[2]));
  });

  createEffect(() => {
    if (zoomInputTimeout) clearTimeout(zoomInputTimeout);

    zoomInputTimeout = setTimeout(() => {
      if (zoomInputValue() === getZoomInputValueFromScale(state.transform[2])) return;

      let scale = getScaleFromZoomInputValue(zoomInputValue());

      if (scale < state.minZoom) {
        scale = state.minZoom;
      } else if (scale > state.maxZoom) {
        scale = state.maxZoom;
      }

      zoomTo(scale);

      setZoomInputValue(getZoomInputValueFromScale(scale));
    }, 500);
  });

  const handleUndo = () => {
    if (typeof undoFn !== 'function') return;

    undoFn();
  };

  const handleRedo = () => {
    if (typeof redoFn !== 'function') return;

    redoFn();
  };

  const handleZoomIn = () => {
    const zoom = Math.min(state.maxZoom, state.transform[2] + 0.04);

    if (state.transform[2] < state.maxZoom) zoomTo(zoom);
  };

  const handleZoomOut = () => {
    const zoom = Math.max(state.minZoom, state.transform[2] - 0.04);

    if (state.transform[2] > state.minZoom) zoomTo(zoom);
  };

  const handleZoomInputChange: JSX.DOMAttributes<HTMLInputElement>['onInput'] = (event) => {
    if (
      event.currentTarget.value.includes('%') &&
      event.currentTarget.value[event.currentTarget.value.length - 1] !== '%'
    )
      return;

    /* eslint-disable no-restricted-globals */
    if (isNaN(+event.currentTarget.value.replace('%', ''))) return;

    setZoomInputValue(event.currentTarget.value);
  };

  const handleEnterFullscreen = () => {
    toggleFullscreen(true);
  };

  const handleExitFullscreen = () => {
    toggleFullscreen(false);
  };

  return (
    <div class="toolbar">
      <Tooltip title={t('undo')}>
        <IconButton
          classList={{ 'toolbar__icon-button': true, 'toolbar__icon-button--mR': true }}
          onClick={handleUndo}
          disabled={!undoRedoState.isUndoable}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('redo')}>
        <IconButton
          classList={{ 'toolbar__icon-button': true, 'toolbar__icon-button--mR': true }}
          onClick={handleRedo}
          disabled={!undoRedoState.isRedoable}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('zoomOut')}>
        <IconButton
          class="toolbar__icon-button"
          onClick={handleZoomOut}
          disabled={state.transform[2] === state.minZoom}
        >
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <input class="toolbar__zoom-input" value={zoomInputValue()} onInput={handleZoomInputChange} />
      <Tooltip title={t('zoomIn')}>
        <IconButton
          classList={{ 'toolbar__icon-button': true, 'toolbar__icon-button--mR': true }}
          onClick={handleZoomIn}
          disabled={state.transform[2] === state.maxZoom}
        >
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <ExportAsPNG storeId={props.storeId} />
      <FocusCenter storeId={props.storeId} />
      <Show
        when={isFullscreen()}
        fallback={
          <Tooltip title={t('enterFullscreen')}>
            <IconButton class="toolbar__icon-button" onClick={handleEnterFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Tooltip title={t('exitFullscreen')}>
          <IconButton class="toolbar__icon-button" onClick={handleExitFullscreen}>
            <FullscreenExitIcon />
          </IconButton>
        </Tooltip>
      </Show>
      <div class="toolbar__separator" />
      <StatusIndicator storeId={props.storeId} />
      <SaveStatus />
    </div>
  );
};

export default Toolbar;
