import type { FormData } from "../types/types";

export const validateFile = (file: File, maxSize: number): string | null => {
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return "Only JPG or PNG files are allowed!";
  }

  if (file.size > maxSize) {
    return `Maximum file size is ${maxSize / (1024 * 1024)} MB!`;
  }

  return null;
};

export const resetForm = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setLogo: (file: File | null) => void
): void => {
  setFormData({ companyName: "", ico: "", address: "", adText: "" });
  setLogo(null);
};
