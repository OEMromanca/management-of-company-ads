import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useModal } from "../context/ModalContext";
import AdFormComponent from "./AdFormComponent";
import AddIcon from "@mui/icons-material/Add";
import { useCompaniesContext } from "../context/CompaniesContext";
import ButtonComponent from "./ButtonComponent";

export default function HeaderComponent() {
  const { openModal } = useModal();
  const { handleCancel } = useCompaniesContext();

  const handleOpenAdForm = () => {
    openModal({
      title: "Create New Ad",
      content: <AdFormComponent />,
      confirmText: "Submit",
      cancelText: "Cancel",
      onCancel: handleCancel,
    });
  };

  return (
    <AppBar component="nav">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MUI Ads
        </Typography>

        <ButtonComponent
          variantType="icon"
          color="primary"
          onClick={handleOpenAdForm}
        >
          <AddIcon sx={{ color: "white" }} />
        </ButtonComponent>
      </Toolbar>
    </AppBar>
  );
}
