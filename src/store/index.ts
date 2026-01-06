import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { usersReducer } from "./users";

// Middleware để lưu state vào LocalStorage
const persistenceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
  return result;
};

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceLocalStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;