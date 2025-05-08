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

// Load initial data from database
const loadInitialData = async () => {
  try {
    const storedWorkflows = await window.api.getWorkflows();
    return {
      ...initialState,
      workflows: storedWorkflows,
    };
  } catch (error) {
    console.error("Failed to load initial data:", error);
    return initialState;
  }
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setWorkflows: (state, action) => {
      state.workflows = action.payload;
    },
    addWorkflow: (state, action) => {
      const newWorkflow = action.payload;
      state.workflows.push(newWorkflow);
    },
    deleteWorkflow: (state, action) => {
      const id = action.payload;
      state.workflows = state.workflows.filter(
        (workflow) => workflow.id !== id
      );
    },
    setCurrentWorkflow: (state, action) => {
      const workflow = action.payload;
      if (workflow) {
        state.currentWorkflow = workflow;
        state.nodes = workflow.nodes || [];
        state.edges = workflow.edges || [];
      } else {
        state.currentWorkflow = null;
        state.nodes = [];
        state.edges = [];
      }
    },
    updateWorkflow: (state, action) => {
      const updatedWorkflow = action.payload;
      const index = state.workflows.findIndex(
        (workflow) => workflow.id === updatedWorkflow.id
      );
      if (index !== -1) {
        state.workflows[index] = updatedWorkflow;
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
      if (!state.nodes) {
        state.nodes = [];
      }
      state.nodes.push(action.payload);
      if (state.currentWorkflow) {
        state.currentWorkflow.nodes = state.nodes;
        window.api.saveWorkflow({
          ...state.currentWorkflow,
          nodes: state.nodes,
          edges: state.edges,
        });
      }
    },
    updateNode: (state, action) => {
      if (!state.nodes) {
        state.nodes = [];
      }
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id
      );
      if (index !== -1) {
        state.nodes[index] = action.payload;
        if (state.currentWorkflow) {
          state.currentWorkflow.nodes = state.nodes;
          window.api.saveWorkflow({
            ...state.currentWorkflow,
            nodes: state.nodes,
            edges: state.edges,
          });
        }
      }
    },
    removeNode: (state, action) => {
      if (!state.nodes) {
        state.nodes = [];
      }
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      if (!state.edges) {
        state.edges = [];
      }
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== action.payload && edge.target !== action.payload
      );
      if (state.currentWorkflow) {
        state.currentWorkflow.nodes = state.nodes;
        state.currentWorkflow.edges = state.edges;
        window.api.saveWorkflow({
          ...state.currentWorkflow,
          nodes: state.nodes,
          edges: state.edges,
        });
      }
    },
    addEdge: (state, action) => {
      if (!state.edges) {
        state.edges = [];
      }
      state.edges.push(action.payload);
      if (state.currentWorkflow) {
        state.currentWorkflow.edges = state.edges;
        window.api.saveWorkflow({
          ...state.currentWorkflow,
          nodes: state.nodes,
          edges: state.edges,
        });
      }
    },
    removeEdge: (state, action) => {
      if (!state.edges) {
        state.edges = [];
      }
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
      if (state.currentWorkflow) {
        state.currentWorkflow.edges = state.edges;
        window.api.saveWorkflow({
          ...state.currentWorkflow,
          nodes: state.nodes,
          edges: state.edges,
        });
      }
    },
  },
});

export const {
  setWorkflows,
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

// Thunks for async operations
export const loadWorkflows = () => async (dispatch) => {
  try {
    const workflows = await window.api.getWorkflows();
    dispatch(setWorkflows(workflows));
  } catch (error) {
    console.error("Failed to load workflows:", error);
  }
};

export const loadWorkflow = (id) => async (dispatch) => {
  try {
    const workflow = await window.api.getWorkflow(id);
    dispatch(setCurrentWorkflow(workflow));
  } catch (error) {
    console.error("Failed to load workflow:", error);
  }
};

export const saveWorkflow = (workflow) => async (dispatch) => {
  try {
    await window.api.saveWorkflow(workflow);
    dispatch(updateWorkflow(workflow));
  } catch (error) {
    console.error("Failed to save workflow:", error);
  }
};

export const removeWorkflow = (id) => async (dispatch) => {
  try {
    await window.api.deleteWorkflow(id);
    dispatch(deleteWorkflow(id));
  } catch (error) {
    console.error("Failed to delete workflow:", error);
  }
};

export default workflowSlice.reducer;
