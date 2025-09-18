import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import HeaderComponent from "../components/HeaderComponent";
import AdsPage from "./AdsPage";

export default function LayoutPage() {
  return (
    <Box>
      <CssBaseline />
      <HeaderComponent />
      <Box component="main" sx={{ paddingTop: 10, px: 2 }}>
        <AdsPage />
      </Box>
    </Box>
  );
}
