import { configureStore } from '@reduxjs/toolkit'
import useReducer from 'userSlice';
import { userSlice } from '../../.history/src/store/users/slice_20231015144708';
export const store = configureStore({
  reducer: {
    user: usersRe
  }
})