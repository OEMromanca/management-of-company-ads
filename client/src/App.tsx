import { Box } from "@mui/material";
import { CompaniesProvider } from "./context/CompaniesContext";
import { ModalProvider } from "./context/ModalContext";
import LayoutPage from "./pages/LayoutPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Box className="App" style={{ height: "100vh", width: "100vw" }}>
      <CompaniesProvider>
        <ModalProvider>
          <LayoutPage />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ModalProvider>
      </CompaniesProvider>
    </Box>
  );
}

export default App;
