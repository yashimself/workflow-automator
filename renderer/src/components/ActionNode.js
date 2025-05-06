import React from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getActionIcon = (type) => {
  switch (type) {
    case "loadData":
      return <FileUploadIcon />;
    case "saveData":
      return <SaveIcon />;
    default:
      return null;
  }
};

const getActionLabel = (type) => {
  switch (type) {
    case "loadData":
      return "Load Data";
    case "saveData":
      return "Save Data";
    default:
      return "Action";
  }
};

const ActionNode = ({ data, id }) => {
  const { type, label, config } = data;

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
        minWidth: 200,
        boxShadow: 1,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {getActionIcon(type)}
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {label || getActionLabel(type)}
        </Typography>
        <Tooltip title="Configure">
          <IconButton size="small" onClick={() => data.onConfigure(id)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => data.onDelete(id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {config && (
        <Box sx={{ mt: 1, fontSize: "0.75rem", color: "text.secondary" }}>
          {type === "loadData" && (
            <Typography variant="caption">
              Source:{" "}
              {config.sourceType === "file" ? config.filePath : "Custom Script"}
            </Typography>
          )}
          {type === "saveData" && (
            <Typography variant="caption">
              Destination: {config.filePath || "Not set"}
            </Typography>
          )}
        </Box>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default ActionNode;
