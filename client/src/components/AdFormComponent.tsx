import {
  Box,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import ButtonComponent from "./ButtonComponent";
import type { Company } from "../types/types";
import FormInputComponent from "./FormInputComponent";
import { useCompaniesContext } from "../context/CompaniesContext";
import { useModal } from "../context/ModalContext";
import { highlightMatch } from "../utils/utils";
import ClearIcon from "@mui/icons-material/Clear";

export default function AdFormComponent() {
  const {
    companyOptions,
    loadingCompanies,
    handleSubmit,
    handleChange,
    handleFileChange,
    formData,
    setFormData,
    logo,
    setLogo,
    handleCancel,
  } = useCompaniesContext();
  const { closeModal } = useModal();

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
    closeModal();
  };

  const onCancel = () => {
    handleCancel();
    closeModal();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        New Ad
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <Autocomplete
          freeSolo
          options={companyOptions}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          loading={loadingCompanies}
          value={
            companyOptions.find((c) => c.name === formData.companyName) ||
            formData.companyName
          }
          onInputChange={(_, value) =>
            setFormData((prev) => ({ ...prev, companyName: value }))
          }
          onChange={(_, value) => {
            if (value && typeof value !== "string") {
              const company = value as Company;
              setFormData({
                companyName: company.name,
                ico: company.ico,
                address: company.address || "",
                adText: formData.adText,
              });
            }
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={key} {...rest}>
                {typeof option === "string"
                  ? option
                  : highlightMatch(option.name, formData.companyName)}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Company Name"
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCompanies && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          freeSolo
          options={companyOptions}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.ico
          }
          loading={loadingCompanies}
          value={formData.ico || ""}
          onInputChange={(_, value) =>
            setFormData((prev) => ({ ...prev, ico: value }))
          }
          onChange={(_, value) => {
            if (value && typeof value !== "string") {
              const company = value as Company;
              setFormData({
                companyName: company.name,
                ico: company.ico,
                address: company.address || "",
                adText: formData.adText,
              });
            }
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <li key={key} {...rest}>
                {option.name}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="ICO"
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCompanies && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <FormInputComponent
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <FormInputComponent
          label="Ad Text"
          name="adText"
          value={formData.adText}
          onChange={handleChange}
          multiline
          rows={3}
          required
        />

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <FormInputComponent
            label="Upload Logo"
            type="file"
            value={logo}
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
          />

          {logo && (
            <ClearIcon
              sx={{
                cursor: "pointer",
                color: "error.main",
                position: "absolute",
                left: "120px",
                bottom: "135px",
              }}
              onClick={() => setLogo(null)}
            />
          )}
        </Box>

        <ButtonComponent
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !formData.companyName.trim() ||
            !formData.ico.trim() ||
            !formData.address.trim() ||
            !formData.adText.trim()
          }
        >
          Submit
        </ButtonComponent>

        <ButtonComponent onClick={onCancel} variant="outlined">
          Cancel
        </ButtonComponent>
      </Box>
    </Container>
  );
}
