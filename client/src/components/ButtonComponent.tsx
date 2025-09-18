import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import type { CustomButtonProps } from "../types/types";

export default function ButtonComponent({
  variantType = "button",
  children,
  sx,
  ...rest
}: CustomButtonProps) {
  const Component: React.ElementType =
    variantType === "icon" ? IconButton : Button;

  return (
    <Component
      {...rest}
      sx={{
        outline: "none",
        "&:focus": { outline: "none" },
        ...(variantType === "button" && { textTransform: "none" }),
        ...sx,
      }}
    >
      {children}
    </Component>
  );
}
