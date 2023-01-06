import { Close } from '@mui/icons-material';
import { Alert, AlertColor, IconButton, Snackbar } from '@mui/material';
import { atom, useAtom } from 'jotai';
import React from 'react';

export const toasterAtom = atom({
  show: false,
  message: '',
  severity: 'info' as AlertColor,
});

const Toaster = () => {
  const [toasterState, setToasterState] = useAtom(toasterAtom);

  const handleCloseToaster = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToasterState({
      ...toasterState,
      show: false,
    });
  };

  const toaster = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseToaster}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={toasterState.show}
      autoHideDuration={3000}
      onClose={handleCloseToaster}
      action={toaster}
    >
      <Alert severity={toasterState.severity}>{toasterState.message}</Alert>
    </Snackbar>
  );
};

export default Toaster;
