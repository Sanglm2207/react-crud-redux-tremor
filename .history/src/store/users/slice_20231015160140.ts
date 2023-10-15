import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserId {
  id: string;
}

export interface User {
  name: string;
  github: string;
  email: string
}

export interface UserWithId extends User {
  id: string
}

export const initialState: UserWithId[] = [
  {
    id: "1",
    name: "Yazman Rodriguez",
    email: "yazmanito@gmail.com",
    github: "yazmanito",
  },
  {
    id: "2",
    name: "John Doe",
    email: "leo@gmail.com",
    github: "leo",
  },
  {
    id: "3",
    name: "Haakon Dahlberg",
    email: "haakon@gmail.com",
    github: "midudev",
  },
];

export const userSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const id = action.payload;
      return state.filter(user => user.id !== id)
    }
  }
})

export default userSlice.reducer