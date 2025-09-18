import { TextField, Button, Typography, Box } from "@mui/material";
import type { FormInputProps } from "../types/types";

export default function FormInputComponent(props: FormInputProps) {
  if (props.type === "file") {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Button variant="outlined" component="label">
          {props.label}
          <input
            type="file"
            accept={props.accept}
            hidden
            onChange={props.onChange}
          />
        </Button>
        {props.value && (
          <Typography variant="body2">{props.value.name}</Typography>
        )}
      </Box>
    );
  }

  const {
    label,
    name,
    value,
    onChange,
    multiline = false,
    rows = 1,
    required = false,
  } = props;
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={rows}
      required={required}
      variant="outlined"
      fullWidth
    />
  );
}
