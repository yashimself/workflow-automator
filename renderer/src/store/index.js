import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./workflowSlice";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
  },
});
