import { createSlice } from '@reduxjs/toolkit'

export interface User {
  name: string;
  github: string;
  email: string
}

export interface UserWithId extends User {
  id: string
}

export const initialState: UserWithId[] = [

]

export const userSlice = createSlice({
  name: 'Users',
  initial: initialState,
  reducers: {}
})