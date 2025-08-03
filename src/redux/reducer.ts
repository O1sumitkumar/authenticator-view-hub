import { combineReducers, Reducer as ReduxReducer } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { PersistConfig } from "redux-persist/es/types";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import authSlice from "./auth/auth.slice";

// Auth persist config (local storage)
const authPersistConfig: PersistConfig<ReturnType<typeof authSlice>> = {
  key: "auth",
  storage: storage,
  whitelist: ["auth"],
  stateReconciler: autoMergeLevel2,
};

// Files config persist config (session storage)
const filesConfigPersistConfig: PersistConfig<ReturnType<any>> = {
  key: "filesConfig",
  // whitelist: [],
  storage: sessionStorage,
  stateReconciler: autoMergeLevel2,
};

// First, persist individual slices that need different storage types
const persistedAuthSlice = persistReducer<ReturnType<typeof authSlice>>(
  authPersistConfig,
  authSlice
);

// const persistedFilesConfigSlice = persistReducer<
//   ReturnType<typeof filesConfigReducer>
// >(filesConfigPersistConfig, filesConfigReducer);

// combine all reducers (some persisted, some not)
const rootReducer: ReduxReducer = combineReducers({
  auth: persistedAuthSlice,
  // filesConfig: persistedFilesConfigSlice,
  //   [api.reducerPath]: api.reducer,
}) as ReduxReducer;

// the root reducer
export const persistedReducer = rootReducer;
