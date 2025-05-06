import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workflows: [],
  currentWorkflow: null,
  executionStatus: "idle",
  logs: [],
  errors: [],
  nodes: [],
  edges: [],
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    addWorkflow: (state, action) => {
      state.workflows.push(action.payload);
    },
    deleteWorkflow: (state, action) => {
      state.workflows = state.workflows.filter(
        (workflow) => workflow.id !== action.payload
      );
    },
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    updateWorkflow: (state, action) => {
      const index = state.workflows.findIndex(
        (workflow) => workflow.id === action.payload.id
      );
      if (index !== -1) {
        state.workflows[index] = action.payload;
      }
    },
    setExecutionStatus: (state, action) => {
      state.executionStatus = action.payload;
    },
    addLog: (state, action) => {
      state.logs.push(action.payload);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    addError: (state, action) => {
      state.errors.push(action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    // Node management actions
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id
      );
      if (index !== -1) {
        state.nodes[index] = action.payload;
      }
    },
    removeNode: (state, action) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      // Also remove any edges connected to this node
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== action.payload && edge.target !== action.payload
      );
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    removeEdge: (state, action) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
    },
  },
});

export const {
  addWorkflow,
  deleteWorkflow,
  setCurrentWorkflow,
  updateWorkflow,
  setExecutionStatus,
  addLog,
  clearLogs,
  addError,
  clearErrors,
  addNode,
  updateNode,
  removeNode,
  addEdge,
  removeEdge,
} = workflowSlice.actions;

export default workflowSlice.reducer;
