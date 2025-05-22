import React from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MuiDialog from '@mui/material/Dialog';
import CustomButton from '../Button';

interface DialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onSuccess: () => void;
}

const Dialog: React.FC<DialogProps> = ({ open, title, content, onClose, onSuccess }) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      translate='yes'
      transitionDuration={1}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton text='Valider' color='success' onClick={onSuccess} />
        <CustomButton text='Annuler' color='error' onClick={onClose} />
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
