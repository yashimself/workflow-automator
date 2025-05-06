import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./components/Header";
import WorkflowList from "./components/WorkflowList";
import WorkflowBuilder from "./components/WorkflowBuilder";
import StatusBar from "./components/StatusBar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header />
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <WorkflowList />
          <WorkflowBuilder />
        </Box>
        <StatusBar />
      </Box>
    </ThemeProvider>
  );
}

export default App;
