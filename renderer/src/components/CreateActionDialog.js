import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateActionDialog = ({ open, onClose, onSave }) => {
  const [action, setAction] = useState({
    name: "",
    type: "",
    config: {},
  });

  const handleSave = () => {
    if (action.name && action.type) {
      onSave({
        ...action,
        id: `${action.type}-${Date.now()}`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Action</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Action Name"
            value={action.name}
            onChange={(e) => setAction({ ...action, name: e.target.value })}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={action.type}
              label="Action Type"
              onChange={(e) => setAction({ ...action, type: e.target.value })}
            >
              <MenuItem value="loadData">Load Data</MenuItem>
              <MenuItem value="saveData">Save Data</MenuItem>
              <MenuItem value="transformData">Transform Data</MenuItem>
              <MenuItem value="filterData">Filter Data</MenuItem>
              <MenuItem value="customScript">Custom Script</MenuItem>
            </Select>
          </FormControl>
          {action.type === "customScript" && (
            <TextField
              label="Python Script"
              value={action.config.script || ""}
              onChange={(e) =>
                setAction({
                  ...action,
                  config: { ...action.config, script: e.target.value },
                })
              }
              multiline
              rows={4}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!action.name || !action.type}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateActionDialog;
