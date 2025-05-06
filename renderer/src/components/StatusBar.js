import React from "react";
import { Paper, Box, Typography, Tabs, Tab } from "@mui/material";
import { useSelector } from "react-redux";

const StatusBar = () => {
  const executionStatus = useSelector(
    (state) => state.workflow.executionStatus
  );
  const logs = useSelector((state) => state.workflow.logs);
  const errors = useSelector((state) => state.workflow.errors);
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper sx={{ height: 200, overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Status" />
          <Tab label="Logs" />
          <Tab label="Errors" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2, height: "calc(100% - 48px)", overflow: "auto" }}>
        {tabValue === 0 && (
          <Typography>Execution Status: {executionStatus}</Typography>
        )}
        {tabValue === 1 && (
          <Box>
            {logs.map((log, index) => (
              <Typography key={index} variant="body2">
                {log}
              </Typography>
            ))}
          </Box>
        )}
        {tabValue === 2 && (
          <Box>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2" color="error">
                {error}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatusBar;
