import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { usersReducer } from "./users";
import { authReducer } from "./auth";
import { permissionsReducer } from "./permissions";
import { rolesReducer } from "./roles";
import { filesReducer } from "./files";
import { mailsReducer } from "./mails";

// Middleware để lưu state vào LocalStorage
const persistenceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    permissions: permissionsReducer,
    roles: rolesReducer,
    files: filesReducer,
    mails: mailsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceLocalStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;