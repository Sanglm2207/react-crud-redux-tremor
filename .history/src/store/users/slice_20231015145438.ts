import { createSlice } from '@reduxjs/toolkit'

interface User {
  name: string;
  github: string;
  email: string
}

export const userSlice = createSlice({
  name: 'Users',
  initial
})