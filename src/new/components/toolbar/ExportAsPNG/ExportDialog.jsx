import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import { useTranslation } from '../../../../../../i18n';
import { exportAsPNG } from '../../../utils/export';

const useStyles = makeStyles(theme => ({
  backdrop: {
    background: '#000012',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-body1': {
      marginRight: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      width: 64,
    },
  },
  qualityContainer: {
    marginTop: theme.spacing(1),
    '& .MuiTypography-body2': {
      color: theme.palette.grey[700],
    },
  },
  mL: {
    marginLeft: theme.spacing(2),
  },
  blackButton: {
    background: '#111',
    color: theme.palette.common.white,
    '&:hover': {
      background: '#000',
    },
  },
}));

const ExportDialog = ({ isOpen, onClose, storeId }) => {
  const classes = useStyles();
  const [margin, setMargin] = useState('16');
  const [qualityLevel, setQualityLevel] = useState('1');
  const [exportDataURL, setExportDataURL] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const downloadAnchorRef = useRef();
  const { t } = useTranslation('dialog');

  const handleSubmitForm = async event => {
    event.preventDefault();
    setIsExporting(true);

    const dataURL = await exportAsPNG({ margin, qualityLevel, storeId });

    setExportDataURL(dataURL);
    setIsExporting(false);
  };

  useEffect(
    () => {
      if (!exportDataURL) return;

      setExportDataURL('');

      downloadAnchorRef.current.click();
    },
    [exportDataURL],
  );

  const validatePositiveIntegerInput = inputValue => {
    /* eslint-disable no-restricted-globals */
    if (isNaN(inputValue)) return false;

    if (Number(inputValue) < 0) return false;

    return true;
  };

  const handleChangeMargin = event => {
    if (!validatePositiveIntegerInput(event.target.value)) return;

    setMargin(event.target.value);
  };

  const handleChangeQualityLevel = event => {
    if (!validatePositiveIntegerInput(event.target.value)) return;

    if (event.target.value === '0') {
      setQualityLevel('1');

      return;
    }

    if (Number(event.target.value) > 10) {
      setQualityLevel('10');

      return;
    }

    setQualityLevel(event.target.value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      aria-describedby="export-dialog-description"
    >
      <div className={classes.backdrop} />
      <form onSubmit={handleSubmitForm}>
        <DialogTitle id="export-dialog-title">
          {t('exportAsPNG')}
          <a
            ref={downloadAnchorRef}
            style={{ visibility: 'hidden' }}
            download="Workflow.png"
            href={exportDataURL}
          >
            .
          </a>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="export-dialog-description">
            {t('exportAsPNGDialogDescription')}
          </DialogContentText>
          <div className={classes.inputContainer}>
            <Typography variant="body1">{t('margin')} (px):</Typography>
            <TextField
              variant="outlined"
              size="small"
              onChange={handleChangeMargin}
              value={margin}
            />
            <Typography variant="body1" className={classes.mL}>
              {t('qualityLevel')}:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              onChange={handleChangeQualityLevel}
              value={qualityLevel}
            />
          </div>
          <div className={classes.qualityContainer}>
            <Typography variant="body2">
              {t('exportAsPNGDialogQualityDescription')}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button
            type="submit"
            variant="contained"
            className={classes.blackButton}
            disabled={isExporting}
          >
            {isExporting ? t('exporting') : t('export')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExportDialog;
