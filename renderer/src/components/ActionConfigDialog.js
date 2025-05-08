import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";

const ActionConfigDialog = ({ open, onClose, onSave, action }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (action?.config) {
      setConfig(action.config);
    } else {
      setConfig({});
    }
  }, [action]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!action) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {action.label}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Action Type: {action.type}
          </Typography>
          {action.type === "python" && (
            <>
              <TextField
                fullWidth
                label="Script Path"
                value={config.scriptPath || ""}
                onChange={(e) =>
                  handleConfigChange("scriptPath", e.target.value)
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Arguments"
                value={config.args || ""}
                onChange={(e) => handleConfigChange("args", e.target.value)}
                margin="normal"
                helperText="Space-separated arguments"
              />
            </>
          )}
          {action.type === "file" && (
            <>
              <TextField
                fullWidth
                label="File Path"
                value={config.filePath || ""}
                onChange={(e) => handleConfigChange("filePath", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="File Format"
                value={config.format || ""}
                onChange={(e) => handleConfigChange("format", e.target.value)}
                margin="normal"
                helperText="e.g., csv, json, txt"
              />
            </>
          )}
          {action.type === "api" && (
            <>
              <TextField
                fullWidth
                label="API URL"
                value={config.url || ""}
                onChange={(e) => handleConfigChange("url", e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Method"
                value={config.method || ""}
                onChange={(e) => handleConfigChange("method", e.target.value)}
                margin="normal"
                helperText="e.g., GET, POST, PUT"
              />
              <TextField
                fullWidth
                label="Headers"
                value={config.headers || ""}
                onChange={(e) => handleConfigChange("headers", e.target.value)}
                margin="normal"
                multiline
                rows={2}
                helperText="JSON format"
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionConfigDialog;
