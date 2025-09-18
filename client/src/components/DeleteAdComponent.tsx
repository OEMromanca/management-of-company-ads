import { useCompaniesContext } from "../context/CompaniesContext";
import { useModal } from "../context/ModalContext";
import type { DeleteAdComponentProps } from "../types/types";
import ButtonComponent from "./ButtonComponent";
import { Box, Stack, Typography } from "@mui/material";

export default function DeleteAdComponent({
  advertId,
}: DeleteAdComponentProps) {
  const { handleDeleteAd } = useCompaniesContext();
  const { closeModal } = useModal();

  const handleConfirm = async () => {
    await handleDeleteAd(advertId);
    closeModal();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography color="text.secondary">
        Do you really want to delete this ad? This action is irreversible.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <ButtonComponent onClick={closeModal}>Cancel</ButtonComponent>
        <ButtonComponent onClick={handleConfirm}>Delete</ButtonComponent>
      </Stack>
    </Box>
  );
}
