import { useState, useLayoutEffect } from 'react';

const useDialogBackdrop = ({ onClose }) => {
  const [dialogRef, setDialogRef] = useState();

  useLayoutEffect(
    () => {
      if (!dialogRef) return;

      const handleMouseDown = event => {
        event.stopPropagation();

        if (event.target === dialogRef.querySelector('.MuiDialog-container')) {
          if (onClose === 'function') onClose();
        }
      };

      dialogRef.addEventListener('mousedown', handleMouseDown);

      return () => dialogRef.removeEventListener('mousedown', handleMouseDown);
    },
    [dialogRef],
  );

  return { setDialogRef };
};

export default useDialogBackdrop;
