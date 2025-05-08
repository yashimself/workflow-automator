import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

const ActionNode = ({ id, data }) => {
  const handleConfigure = (e) => {
    e.stopPropagation();
    data.onConfigure(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    data.onDelete(id);
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        minWidth: 150,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {data.label}
        </Typography>
        <IconButton size="small" onClick={handleConfigure} sx={{ mr: 0.5 }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDelete} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {data.type}
      </Typography>
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
};

export default memo(ActionNode);
