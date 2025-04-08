import { useContext } from "react";
import { NavLink } from "react-router"; // ✅ Fixed
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import Movielist from "./components/Movielist";
import Moviedetial from "./components/Moviedetial";
import Quicklist from "./components/Quicklist";
import ListState from "./context/ListState";
import listContext from "./context/listContext";

// Main App
function App() {
  const { darkMode } = useContext(listContext);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" >
          <Quicklist />
          <Movielist />
          <Moviedetial />
        </Box>
      </ThemeProvider>
  );
}

export default App;
