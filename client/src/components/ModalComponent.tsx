import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ButtonComponent from "./ButtonComponent";
import type { ReusableModalProps } from "../types/types";

export default function ModalComponent({
  open,
  title,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "Potvrdiť",
  cancelText = "Zrušiť",
  children,
}: ReusableModalProps) {
  const handleClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        {onCancel && (
          <ButtonComponent
            variantType="button"
            onClick={handleClose}
            variant="outlined"
            color="secondary"
          >
            {cancelText}
          </ButtonComponent>
        )}
        {onConfirm && (
          <ButtonComponent
            variantType="button"
            onClick={onConfirm}
            variant="contained"
            color="primary"
          >
            {confirmText}
          </ButtonComponent>
        )}
      </DialogActions>
    </Dialog>
  );
}
