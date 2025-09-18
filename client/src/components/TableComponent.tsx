import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TableRowComponent } from "./TableRowComponent";
import type { ReusableTableProps } from "../types/types";

export default function TableComponent<T extends { _id?: string }>({
  data = [],
  columns = [],
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onChangePage,
  onChangeRowsPerPage,
}: ReusableTableProps<T>) {
  const handlePageChange = (_: unknown, newPage: number) => {
    onChangePage(newPage);
  };

  const handleRowsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeRowsPerPage(+event.target.value);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="reusable table" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{ fontWeight: "bold", width: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRowComponent
                key={row._id || Math.random().toString()}
                row={row}
                mainColumns={columns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsChange}
        showLastButton
        showFirstButton
      />
    </>
  );
}
