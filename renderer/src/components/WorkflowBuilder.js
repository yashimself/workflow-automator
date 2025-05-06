import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, Button, Typography, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNode, updateNode, removeNode } from "../store/workflowSlice";
import ActionNode from "./ActionNode";
import ActionConfigDialog from "./ActionConfigDialog";

const nodeTypes = {
  action: ActionNode,
};

const WorkflowBuilder = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state) => state.workflow);
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.edges);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const addNewNode = useCallback(
    (type, position) => {
      const newNode = {
        id: `${type}-${Date.now()}`,
        type: "action",
        position,
        data: {
          type,
          label: type === "loadData" ? "Load Data" : "Save Data",
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

  const handleActionSelect = (type) => {
    handleAddActionClose();
    addNewNode(type, {
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
            <MenuItem onClick={() => handleActionSelect("loadData")}>
              Load Data
            </MenuItem>
            <MenuItem onClick={() => handleActionSelect("saveData")}>
              Save Data
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
    </Box>
  );
};

export default WorkflowBuilder;
