import type { ButtonProps } from "@mui/material/Button";
import type { IconButtonProps } from "@mui/material/IconButton";

export interface EditAdFormProps {
  advertId: string;
  initialText: string;
}

export interface DeleteAdComponentProps {
  advertId: string;
}

export interface Company {
  _id: string;
  ico: string;
  name: string;
  address: string;
  adverts: IAds[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCompanies {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  entities: Company[];
}

export interface IAds {
  _id: string;
  name: string;
  ico: string;
  address: string;
  text: string;
  logoBase64?: string;
  createdAt: string;
  isTop?: boolean;
}

export interface FormData {
  companyName: string;
  ico: string;
  address: string;
  adText: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: { [key: string]: string[] };
}

export interface ReusableModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  page: number;
  rowsPerPage: number;
  total: number;
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (newRows: number) => void;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableRowComponentProps<T> {
  row: T;
  mainColumns: Column<T>[];
}

export type FormInputProps =
  | {
      type?: "text" | "textarea";
      label: string;
      name?: string;
      value: string;
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void;
      multiline?: boolean;
      rows?: number;
      required?: boolean;
    }
  | {
      type: "file";
      label: string;
      value: File | null;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      accept?: string;
    };

export type CustomButtonProps =
  | ({ variantType?: "button" } & ButtonProps)
  | ({ variantType: "icon" } & IconButtonProps);
