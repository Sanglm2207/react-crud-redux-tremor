import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './users/slice';

const persistancceLocalStorageMiddleware = (store) => next => action => {
  next(action)
  localStorage.setItem('__redux__state__', JOSN.stringify(store.getState()))
}

export const store = configureStore({
  reducer: {
    users: usersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.getState