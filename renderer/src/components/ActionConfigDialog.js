import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";

const ActionConfigDialog = ({ open, onClose, onSave, action }) => {
  const [config, setConfig] = useState(action?.config || {});

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const renderLoadDataConfig = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl>
        <FormLabel>Source Type</FormLabel>
        <RadioGroup
          value={config.sourceType || "file"}
          onChange={(e) => setConfig({ ...config, sourceType: e.target.value })}
        >
          <FormControlLabel value="file" control={<Radio />} label="File" />
          <FormControlLabel
            value="script"
            control={<Radio />}
            label="Custom Script"
          />
        </RadioGroup>
      </FormControl>

      {config.sourceType === "file" ? (
        <TextField
          label="File Path"
          value={config.filePath || ""}
          onChange={(e) => setConfig({ ...config, filePath: e.target.value })}
          fullWidth
        />
      ) : (
        <TextField
          label="Custom Script"
          value={config.script || ""}
          onChange={(e) => setConfig({ ...config, script: e.target.value })}
          multiline
          rows={4}
          fullWidth
        />
      )}
    </Box>
  );

  const renderSaveDataConfig = () => (
    <TextField
      label="Save Path"
      value={config.filePath || ""}
      onChange={(e) => setConfig({ ...config, filePath: e.target.value })}
      fullWidth
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Configure {action?.type === "loadData" ? "Load Data" : "Save Data"}{" "}
        Action
      </DialogTitle>
      <DialogContent>
        {action?.type === "loadData" && renderLoadDataConfig()}
        {action?.type === "saveData" && renderSaveDataConfig()}
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
