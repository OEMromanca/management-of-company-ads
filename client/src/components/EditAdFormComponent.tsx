import { Box, Container, Typography } from "@mui/material";
import FormInputComponent from "./FormInputComponent";
import { useCompaniesContext } from "../context/CompaniesContext";
import { useModal } from "../context/ModalContext";
import { useEffect } from "react";
import type { EditAdFormProps } from "../types/types";
import ButtonComponent from "./ButtonComponent";

export default function EditAdFormComponent({
  advertId,
  initialText,
}: EditAdFormProps) {
  const { handleUpdateAd, formData, setFormData } = useCompaniesContext();
  const { closeModal } = useModal();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, adText: initialText }));
  }, [initialText, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adText?.trim()) return;

    await handleUpdateAd(advertId, formData.adText);
    closeModal();
  };

  const onCancel = () => {
    setFormData((prev) => ({ ...prev, adText: initialText }));
    closeModal();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Ad
      </Typography>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <FormInputComponent
          label="Ad Text"
          name="adText"
          value={formData.adText}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, adText: e.target.value }))
          }
          multiline
          rows={4}
          required
        />
        <ButtonComponent
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formData.adText?.trim()}
        >
          Save
        </ButtonComponent>
        <ButtonComponent onClick={onCancel} variant="outlined">
          Cancel
        </ButtonComponent>
      </Box>
    </Container>
  );
}
