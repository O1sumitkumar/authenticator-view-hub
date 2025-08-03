import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectedReducer = (state: RootState) => state.fileReducer;

// this is selector for auth token
export const selectAuthToken = createDraftSafeSelector(
  selectedReducer,
  (authState) => authState.token
);
