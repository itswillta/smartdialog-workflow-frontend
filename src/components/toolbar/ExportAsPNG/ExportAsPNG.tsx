import { useI18n } from '@amoutonbrady/solid-i18n';
import { Component, createSignal } from 'solid-js';
import IconButton from '../../common/IconButton/IconButton';
import Tooltip from '../../common/Tooltip/Tooltip';
import PhotoIcon from '../../icons/PhotoIcon';

import ExportDialog from './ExportDialog';
import './ExportAsPNG.scss';

interface ExportAsPNGProps {
  storeId: string;
}

const ExportAsPNG: Component<ExportAsPNGProps> = (props) => {
  const [t] = useI18n();
  const [isExportDialogOpen, setIsExportDialogOpen] = createSignal(false);

  const handleExportAsPNG = () => {
    setIsExportDialogOpen(true);
  };

  const handleCloseExportDialog = () => {
    setIsExportDialogOpen(false);
  };

  return (
    <>
      <Tooltip title={t('exportAsPNG')}>
        <IconButton class="export-as-png__icon-button" onClick={handleExportAsPNG}>
          <PhotoIcon />
        </IconButton>
      </Tooltip>
      <ExportDialog isOpen={isExportDialogOpen()} onClose={handleCloseExportDialog} storeId={props.storeId} />
    </>
  );
};

export default ExportAsPNG;
