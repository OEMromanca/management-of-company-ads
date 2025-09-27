import { Typography, CircularProgress, Box } from "@mui/material";
import TableComponent from "../components/TableComponent";
import { generatePDF } from "../utils/pdfGenerator";
import { useCompaniesContext } from "../context/CompaniesContext";
import type { Column, IAds } from "../types/types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteAdComponent from "../components/DeleteAdComponent";
import { useModal } from "../context/ModalContext";
import EditAdFormComponent from "../components/EditAdFormComponent";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import DownloadIcon from "@mui/icons-material/Download";
import ButtonComponent from "../components/ButtonComponent";

export default function AdsPage() {
  const {
    adsLoading,
    adsPageLoading,
    ads,
    adsPage,
    adsLimit,
    adsTotal,
    handleChangePage,
    handleChangeRowsPerPage,
    handleToggleTopAd,
  } = useCompaniesContext();

  const { openModal, closeModal } = useModal();

  const handleDeleteAd = (advertId: string) => {
    openModal({
      title: "Delete Ad",
      content: <DeleteAdComponent advertId={advertId} />,
      confirmText: "",
      cancelText: "",
      onCancel: closeModal,
    });
  };

  const handleEditAd = (advertId: string) => {
    const ad = ads.find((a) => a._id === advertId);
    if (!ad) return;

    openModal({
      title: "Edit Ad",
      content: (
        <EditAdFormComponent advertId={advertId} initialText={ad.text} />
      ),
      confirmText: "",
      cancelText: "",
      onCancel: closeModal,
    });
  };

  const columns: Column<IAds>[] = [
    {
      key: "logoBase64",
      label: "Logo",
      width: "5%",
      render: (row) =>
        row.logoBase64 ? (
          <img
            src={
              row.logoBase64.startsWith("data:")
                ? row.logoBase64
                : `data:image/png;base64,${row.logoBase64}`
            }
            alt="Logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        ) : (
          <span>-</span>
        ),
    },
    { key: "companyName", label: "Company Name", width: "20%" },
    { key: "address", label: "Address", width: "20%" },
    { key: "ico", label: "ICO", width: "10%" },
    { key: "text", label: "Ad Text", width: "30%" },
    {
      key: "top",
      label: "",
      width: "5%",
      render: (row) => (
        <ButtonComponent
          variantType="icon"
          size="small"
          onClick={() => handleToggleTopAd(row._id)}
        >
          {row.isTop ? <StarIcon color="warning" /> : <StarBorderIcon />}
        </ButtonComponent>
      ),
    },
    {
      key: "edit",
      label: "",
      width: "5%",
      render: (row) => (
        <ButtonComponent
          variantType="icon"
          size="small"
          onClick={() => handleEditAd(row._id)}
        >
          <EditIcon />
        </ButtonComponent>
      ),
    },
    {
      key: "delete",
      label: "",
      width: "5%",
      render: (row) => (
        <ButtonComponent
          variantType="icon"
          size="small"
          onClick={() => handleDeleteAd(row._id)}
        >
          <DeleteOutlineIcon />
        </ButtonComponent>
      ),
    },
    {
      key: "download",
      label: "PDF",
      width: "5%",
      render: (row) => (
        <ButtonComponent
          variantType="icon"
          size="small"
          onClick={() => generatePDF(row)}
        >
          <DownloadIcon />
        </ButtonComponent>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ads List
      </Typography>

      <Box className="relative">
        <TableComponent
          data={ads}
          columns={columns}
          page={adsPage}
          rowsPerPage={adsLimit}
          total={adsTotal}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />

        {ads.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              flexDirection: "column",
            }}
          >
            {adsLoading || adsPageLoading ? (
              <CircularProgress />
            ) : (
              <Typography
                variant="body1"
                align="center"
                sx={{ fontStyle: "italic" }}
              >
                No ads available
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
