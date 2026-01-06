import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { User, UserId, UsersState, UserWithId } from "./types";

const DEFAULT_STATE: UsersState = [
  { id: "1", name: "Yazman Rodriguez", email: "yazmanito@gmail.com" },
  { id: "2", name: "John Doe", email: "leo@gmail.com" },
  { id: "3", name: "Haakon Dahlberg", email: "haakon@gmail.com" },
];

// Logic lấy state ban đầu từ LocalStorage
const initialState: UsersState = (() => {
  const persistedState = localStorage.getItem("__redux__state__");
  return persistedState ? JSON.parse(persistedState).users : DEFAULT_STATE;
})();

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      const maxId = state.reduce((max, user) => {
        const currentId = parseInt(user.id, 10);
        return currentId > max ? currentId : max;
      }, 0);
      const newId = (maxId + 1).toString();
      state.push({ id: newId, ...action.payload });
    },
    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const id = action.payload;
      return state.filter((user) => user.id !== id);
    },
    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const isUserAlreadyDefined = state.some((user) => user.id === action.payload.id);
      if (!isUserAlreadyDefined) {
        state.push(action.payload);
      }
    },
  },
});

// Export reducer để gắn vào store
export default usersSlice.reducer;

// Export các action raw (internal use hoặc dùng trong actions.ts)
export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;