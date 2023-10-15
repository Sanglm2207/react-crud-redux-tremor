import { Middleware, configureStore } from '@reduxjs/toolkit'
import usersReducer from './users/slice';

const persistanceLocalStorageMiddleware: Middleware = store => next => action => {
  next(action)
  localStorage.setItem('__redux__state__', JSON.stringify(store.getState()))
}

const syncWithDataBaseMiddleware: Middleware = store => next => action => {
  const { type, payload } = action;

  console.log({ type, payload });
  console.log(store.getState());

}

export const store = configureStore({
  reducer: {
    users: usersReducer
  },
  middleware: [persistanceLocalStorageMiddleware, syncWithDataBaseMiddleware]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.getState