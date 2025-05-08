import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { addNode, updateNode, removeNode } from "../store/workflowSlice";
import ActionNode from "./ActionNode";
import ActionConfigDialog from "./ActionConfigDialog";
import CreateActionDialog from "./CreateActionDialog";

const nodeTypes = {
  action: ActionNode,
};

const WorkflowBuilder = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state) => state.workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [createActionDialogOpen, setCreateActionDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [availableActions, setAvailableActions] = useState([]);

  // Load available actions
  useEffect(() => {
    const loadActions = async () => {
      try {
        const actions = await window.api.getActions();
        setAvailableActions(actions);
      } catch (error) {
        console.error("Failed to load actions:", error);
      }
    };
    loadActions();
  }, []);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      dispatch(updateNode({ id: node.id, position: node.position }));
    },
    [dispatch]
  );

  const handleConfigure = useCallback(
    (nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      setSelectedNode(node);
      setConfigDialogOpen(true);
    },
    [nodes]
  );

  const handleDelete = useCallback(
    (nodeId) => {
      dispatch(removeNode(nodeId));
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    },
    [dispatch, setNodes]
  );

  const handleConfigSave = useCallback(
    (config) => {
      if (selectedNode) {
        const updatedNode = {
          ...selectedNode,
          data: {
            ...selectedNode.data,
            config,
          },
        };
        dispatch(updateNode(updatedNode));
        setNodes((nds) =>
          nds.map((n) => (n.id === selectedNode.id ? updatedNode : n))
        );
      }
    },
    [selectedNode, dispatch, setNodes]
  );

  const handleCreateAction = async (newAction) => {
    try {
      await window.api.saveAction(newAction);
      setAvailableActions((prev) => [...prev, newAction]);
    } catch (error) {
      console.error("Failed to create action:", error);
    }
  };

  const handleDeleteAction = async (actionId, event) => {
    event.stopPropagation();
    try {
      await window.api.deleteAction(actionId);
      setAvailableActions((prev) => prev.filter((a) => a.id !== actionId));
    } catch (error) {
      console.error("Failed to delete action:", error);
    }
  };

  const addNewNode = useCallback(
    (action, position) => {
      const newNode = {
        id: `${action.type}-${Date.now()}`,
        type: "action",
        position,
        data: {
          type: action.type,
          label: action.name,
          config: action.config,
          onConfigure: handleConfigure,
          onDelete: handleDelete,
        },
      };
      dispatch(addNode(newNode));
      setNodes((nds) => [...nds, newNode]);
    },
    [dispatch, setNodes, handleConfigure, handleDelete]
  );

  const handleAddActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddActionClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    handleAddActionClose();
    addNewNode(action, {
      x: Math.random() * 500,
      y: Math.random() * 500,
    });
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Workflow Builder</Typography>
        <Box>
          <Button variant="contained" onClick={handleAddActionClick}>
            Add Action
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAddActionClose}
          >
            {availableActions.map((action) => (
              <MenuItem
                key={action.id}
                onClick={() => handleActionSelect(action)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{action.name}</span>
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteAction(action.id, e)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            ))}
            <MenuItem onClick={() => setCreateActionDialogOpen(true)}>
              + Create New Action
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <ActionConfigDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onSave={handleConfigSave}
        action={selectedNode?.data}
      />
      <CreateActionDialog
        open={createActionDialogOpen}
        onClose={() => setCreateActionDialogOpen(false)}
        onSave={handleCreateAction}
      />
    </Box>
  );
};

export default WorkflowBuilder;
