import { UserId, deleteUserById } from "../store/users/slice";
import { useAppDispatch } from "./store";

export const useUserActions = () => {
  const dispatch = useAppDispatch();

  const addUser = (name, email, github) => {
    dispatch(addNewUser(id));
  };

  const removeUser = (id: UserId) => {
    dispatch(deleteUserById(id));
  };

  return { removeUser, addUser };
};
