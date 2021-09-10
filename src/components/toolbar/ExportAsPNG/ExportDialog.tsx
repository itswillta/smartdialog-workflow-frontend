import { Component, createEffect, createSignal, JSX, Show } from 'solid-js';
import { useI18n } from '@amoutonbrady/solid-i18n';

import { exportAsPNG } from '../../../utils/export';
import Dialog from '../../common/Dialog/Dialog';
import DialogContent from '../../common/Dialog/DialogContent';
import DialogTitle from '../../common/Dialog/DialogTitle';
import DialogContentText from '../../common/Dialog/DialogContentText';
import Button from '../../common/Button/Button';
import DialogActions from '../../common/Dialog/DialogActions';
import './ExportDialog.scss';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

const ExportDialog: Component<ExportDialogProps> = (props) => {
  const [t] = useI18n();
  const [margin, setMargin] = createSignal('16');
  const [qualityLevel, setQualityLevel] = createSignal('1');
  const [exportDataURL, setExportDataURL] = createSignal('');
  const [isExporting, setIsExporting] = createSignal(false);
  let downloadAnchorRef: HTMLAnchorElement;

  const handleSubmitForm = async (event: Event) => {
    event.preventDefault();
    setIsExporting(true);

    const dataURL = await exportAsPNG({
      margin: Number(margin()),
      qualityLevel: Number(qualityLevel()),
      storeId: props.storeId,
    });

    setExportDataURL(dataURL);
    setIsExporting(false);
  };

  createEffect(() => {
    if (!exportDataURL()) return;

    setExportDataURL('');

    downloadAnchorRef.click();
  });

  const validatePositiveIntegerInput = (inputValue: string) => {
    if (isNaN(Number(inputValue))) return false;

    if (Number(inputValue) < 0) return false;

    return true;
  };

  const handleChangeMargin: JSX.DOMAttributes<HTMLInputElement>['onInput'] = (event) => {
    if (!validatePositiveIntegerInput(event.currentTarget.value)) return;

    setMargin(event.currentTarget.value);
  };

  const handleChangeQualityLevel: JSX.DOMAttributes<HTMLInputElement>['onInput'] = (event) => {
    if (!validatePositiveIntegerInput(event.currentTarget.value)) return;

    if (event.currentTarget.value === '0') {
      setQualityLevel('1');

      return;
    }

    if (Number(event.currentTarget.value) > 10) {
      setQualityLevel('10');

      return;
    }

    setQualityLevel(event.currentTarget.value);
  };

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="export-dialog-title"
      aria-describedby="export-dialog-description"
    >
      <div class="export-dialog__backdrop" />
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="export-dialog-title">
          {t('exportAsPNG')}
          <a ref={downloadAnchorRef} style={{ visibility: 'hidden' }} download="Workflow.png" href={exportDataURL()}>
            .
          </a>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="export-dialog-description">{t('exportAsPNGDialogDescription')}</DialogContentText>
          <div class="export-dialog__input-container">
            <p class="export-dialog__input-container__text">{t('margin')} (px):</p>
            <input onInput={handleChangeMargin} value={margin()} />
            <p class="export-dialog__input-container__text export-dialog__input-container__text--mL">
              {t('qualityLevel')}:
            </p>
            <input onInput={handleChangeQualityLevel} value={qualityLevel()} />
          </div>
          <div class="export-dialog__quality-container">
            <p>{t('exportAsPNGDialogQualityDescription')}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>{t('cancel')}</Button>
          <Button type="submit" variant="contained" class="export-dialog__black-button" disabled={isExporting()}>
            <Show when={isExporting()} fallback={t('export')}>
              {t('exporting')}
            </Show>
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExportDialog;
