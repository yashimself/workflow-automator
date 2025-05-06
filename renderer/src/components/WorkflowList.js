import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import {
  addWorkflow,
  deleteWorkflow,
  setCurrentWorkflow,
} from "../store/workflowSlice";

const WorkflowList = () => {
  const workflows = useSelector((state) => state.workflow.workflows);
  const currentWorkflow = useSelector(
    (state) => state.workflow.currentWorkflow
  );
  const dispatch = useDispatch();

  const handleAddWorkflow = () => {
    const newWorkflow = {
      id: Date.now().toString(),
      name: `Workflow ${workflows.length + 1}`,
      steps: [],
    };
    dispatch(addWorkflow(newWorkflow));
    dispatch(setCurrentWorkflow(newWorkflow));
  };

  const handleSelectWorkflow = (workflow) => {
    dispatch(setCurrentWorkflow(workflow));
  };

  const handleDeleteWorkflow = (id, e) => {
    e.stopPropagation();
    dispatch(deleteWorkflow(id));
    if (currentWorkflow?.id === id) {
      dispatch(setCurrentWorkflow(null));
    }
  };

  return (
    <Paper sx={{ width: 300, height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Workflows</Typography>
        <IconButton onClick={handleAddWorkflow} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <List>
        {workflows.map((workflow) => (
          <ListItem
            key={workflow.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton
              selected={currentWorkflow?.id === workflow.id}
              onClick={() => handleSelectWorkflow(workflow)}
            >
              <ListItemText primary={workflow.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default WorkflowList;
