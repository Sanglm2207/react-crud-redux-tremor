import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_STATE = [
  {
    id: "1",
    name: "Yazman Rodriguez",
    email: "yazmanito@gmail.com",
  },
  {
    id: "2",
    name: "John Doe",
    email: "leo@gmail.com",
  },
  {
    id: "3",
    name: "Haakon Dahlberg",
    email: "haakon@gmail.com",
  },
];

export type UserId = string;

export interface User {
  name: string;
  email: string;
}

export interface UserWithId extends User {
  id: UserId;
}

const initialState: UserWithId[] = (() => {
  const persistedState = localStorage.getItem("__redux__state__");
  return persistedState ? JSON.parse(persistedState).users : DEFAULT_STATE;
})();

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      // Get the highest current ID and increment by 1
      const maxId = state.reduce((max, user) => {
        const currentId = parseInt(user.id, 10);
        return currentId > max ? currentId : max;
      }, 0);
      const newId = (maxId + 1).toString();

      state.push({ id: newId, ...action.payload })
    },
    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const id = action.payload;
      return state.filter((user) => user.id !== id);
    },
    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const isUserAlreadyDefined = state.some(user => user.id === action.payload.id)
      if (!isUserAlreadyDefined) {
        state.push(action.payload)
      }
    }
  },
});

export default usersSlice.reducer;

export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;