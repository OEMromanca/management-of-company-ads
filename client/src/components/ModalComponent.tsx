import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import type { ReusableModalProps } from "../types/types";

export default function ModalComponent({
  open,
  title,
  onClose,
  onCancel,
  children,
}: ReusableModalProps) {
  const handleClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      data-testid="modal-dialog"
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
