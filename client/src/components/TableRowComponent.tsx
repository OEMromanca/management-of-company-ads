import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import type { TableRowComponentProps } from "../types/types";

export function TableRowComponent<T extends { _id?: string }>({
  row,
  mainColumns,
}: TableRowComponentProps<T>) {
  return (
    <TableRow hover>
      {mainColumns.map((col) => (
        <TableCell key={String(col.key)} sx={{ width: col.width }}>
          {col.render ? col.render(row) : (row as any)[col.key]}
        </TableCell>
      ))}
    </TableRow>
  );
}
